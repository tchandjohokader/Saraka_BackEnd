const express =require('express')
const app =express()
const uuid =require('uuid');
const date = require('date-and-time');
const redirectify = require('redirectify');
const mysql =require('mysql')
const mysqlconnection =require('express-myconnection');
require('dotenv').config({path:'./src/config/.env'})
const db=require('./src/config/db')
let PORT=process.env.PORT || 5000

app.use(mysqlconnection(mysql,db.donnedeconnection,'pool'))
app.use(express.urlencoded({extended:true}))

//recuperation db
app.get('/',(req,res)=>{
    req.getConnection((error,connection)=>{
        if(error){
            res.status(404).send('erreur de connection')
        }else{
            connection.query('SELECT * FROM utilisateur',(error,resultat)=>{
                if(error){
                    res.status(404).send('erreur de commande')
                }else{
                    res.send(resultat)
                }
            })
        }
    })
})

//insertion db


app.post('/inscription',(req,res)=>{
    let id =uuid.v4()
    let nom=req.body.nom
    let prenom=req.body.prenom
    let email=req.body.email
    let motdepasse=req.body.motdepasse
    let numero=req.body.numero
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).send('erreur de connection avec la db')
        }else{
            const query = `INSERT INTO utilisateur(id_user, Nom, Prenom, Email, Motdepasse, Numero) VALUES (?, ?, ?, ?, ?, ?)`;
            connection.query(query,[id,nom,prenom,email,motdepasse,numero],(error,resultat)=>{
                if(error){
                    res.status(404).send(error)
                    id =uuid.v4()
                }else{
                    //res.redirect('/')
                }
            })
        }
    })
})
//connection
app.get('/connection',(req,res)=>{
    let email=req.body.email='marie@example.com'
    let motdepasse=req.body.motdepasse='motdepasse1'
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).send('erreur de connection avec la db')
        }else{
            connection.query("SELECT * FROM utilisateur WHERE Email = ? AND Motdepasse=? ",[email,motdepasse],(error,resultat)=>{
                if(error){
                    res.status(404).send('erreur de commande')
                }else{
                    resultat.length==0? res.status(401).send('email ou mot de passe incorrecte'):res.status(200).send('connection')
                }
            })
        }
    })
})
//afficher une seul ong
app.get('/faireundon/:id',(req,res)=>{
    let id=req.params.id
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).send('erreur de connection avec la db')
        }else{
            connection.query("SELECT * FROM ong WHERE id_ong = ? ",[id],(error,resultat)=>{
                if(error){
                    res.status(404).send('erreur de commande')
                }else{
                   res.status(201).json(resultat)
                }
            })
        }
    })
})
//recherche
app.get('/recherche/:lettre',(req,res)=>{
    let lettre=req.params.lettre
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).send('erreur de connection avec la db')
        }else{
            connection.query(`SELECT * FROM ong WHERE Nom_ong LIKE '%${lettre}%'`,(error,resultat)=>{
                if(error){
                    res.status(404).send('erreur de commande')
                }else{
                   res.status(201).json(resultat)
                }
            })
        }
    })
})
//recherche par categorie
app.get('/ong/:categorie',(req,res)=>{
    let categorie=req.params.categorie
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).send('erreur de connection avec la db')
        }else{
            connection.query(`SELECT * FROM ong WHERE Domaine_ong =?`,[categorie],(error,resultat)=>{
                if(error){
                    res.status(404).send('erreur de commande')
                }else{
                   res.status(201).json(resultat)
                }
            })
        }
    })
})
//faire un don materiel
app.post('/don/materiel/:id',(req,res)=>{
    let id_ong =req.params.id
    let categorie=req.body.categorie
    let query = "INSERT INTO aide(id_user, id_ong, type_aide, categorie, date_aide) VALUES (?, ?, ?, ?, ?)";
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).send('erreur de connection avec la db')
        }else{
            
            connection.query(query,[id,id_ong,'materiel',categorie,date.format(new Date(), 'DD-MM-YYYY')],(error,resultat)=>{
                if(error){
                    res.status(404).send('error')
                }else{
                    res.status(200).json('merci pour votre don')
                }
            })
        }
    })
})

//faire un don en argent
app.post('/don/argent/:id',(req,res)=>{
    let id_ong =req.params.id
    let montant=req.body.montant
    let query = "INSERT INTO aide(id_user, id_ong, type_aide, montant, date_aide) VALUES (?, ?, ?, ?, ?)";
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).send('erreur de connection avec la db')
        }else{
            
            connection.query(query,[id,id_ong,'financier',montant,date.format(new Date(), 'DD-MM-YYYY')],(error,resultat)=>{
                if(error){
                    res.status(404).send('error')
                }else{
                    res.status(200).json('merci pour votre don')
                }
            })
        }
    })
})

//Mon compte
app.get('/moncompte',(req,res)=>{
    let id_user=req.body.id_user
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).json('erreur de connection')
        }else{
            connection.query('SELECT * FROM aider WHERE id_user = ?',[id_user],(error,resultat)=>{
                if(error){
                    res.status(500).json('commande invalide')
                }else{
                    res.status(200).json(resultat)
                }
            })
        }
    })
})

//payement avec paytech

//implementation de yango deli

//scrapping des association caritative


app.listen(PORT)
