const fs = require('fs')
const data = require("./data.json");
const Intl = require('intl')
const { age, date } = require("./utils")

exports.show = (req,res) => {
    const {id} = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id
    })

    if (!foundInstructor) {
        return res.send("Instructor not found")
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at : new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }

    return res.render("instructors/show", { instructor })
}

//Create
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
    const id = Number(data.instructors.length + 1)

    //Dados inseridos no array
    data.instructors.push({
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
        return res.redirect("/instructors")
    })

}

//Update
exports.edit = (req,res) => {
    const {id} = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id
    })

    if (!foundInstructor) {
        return res.send("Instructor not found")
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit', { instructor })
}

exports.put = (req,res) => {
    const {id} = req.body
    let index = 0

    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) {
        return res.send("Instructor not found")
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json",JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error")
        } else {
            return res.redirect(`/instructors/${id}`)
        }
    })
}
//Delete

exports.delete = (req,res) => {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter((instructor) => {
        return instructor.id != id
    }) 

    data.instructors = filteredInstructors;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error")
        } 
        
        return res.redirect("/instructors")
        
    })
}