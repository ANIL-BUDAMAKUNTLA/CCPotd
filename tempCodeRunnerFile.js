
app.get('/getallquery',async(req,res)=>{
    let data = await Post.findAll({
        where : {ispost:0}
    })
    return res.send(data)
})

app.post('/user',async(req,res)=>{
    console.log(req.body)
    await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        about:req.body.about,
        image:req.body.image
    }).then(res.send({"success":"true"}));               
})

app.post('/post',async(req,res)=>{
    console.log(req.body)
    await Post.create({
        createrid: req.body.createrid,
        about:req.body.about,
        description:req.body.description,
        image:req.body.image,
        ispost:req.body.ispost
    }).then(res.send({"success":"true"}));               
})

