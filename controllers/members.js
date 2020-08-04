const fs = require('fs')
const data = require("../data.json");
const Intl = require('intl')
const { age, date } = require("../utils")

exports.index = (req,res) => {

    return res.render("members/index", {members : data.members})
}


exports.show = (req,res) => {
    const {id} = req.params

    const foundMember = data.members.find((member) => {
        return member.id == id
    })

    if (!foundMember) {
        return res.send("Member not found")
    }

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    }

    return res.render("members/show", { member })
}

//Create
exports.create = (req,res) => {
    return res.render("members/create")
}

exports.post = (req,res) => {
    
    const keys = Object.keys(req.body);
    //Validação
    for (key of keys) {
        //req.body.key ==""
        if (req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    //Tratamentos dos dados
    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.members.length + 1)

    //Dados inseridos no array
    data.members.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at
    })

    //Gravação em arquivo .json
    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error")
        }
        return res.redirect("/members")
    })

}

//Update
exports.edit = (req,res) => {
    const {id} = req.params

    const foundMember = data.members.find((member) => {
        return member.id == id
    })

    if (!foundMember) {
        return res.send("Member not found")
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth)
    }

    return res.render('members/edit', { member })
}

exports.put = (req,res) => {
    const {id} = req.body
    let index = 0

    const foundMember = data.members.find((member, foundIndex) => {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) {
        return res.send("Member not found")
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json",JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error")
        } else {
            return res.redirect(`/members/${id}`)
        }
    })
}
//Delete

exports.delete = (req,res) => {
    const { id } = req.body

    const filteredMembers = data.members.filter((member) => {
        return member.id != id
    }) 

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error")
        } 
        
        return res.redirect("/members")
        
    })
}

