require('dotenv').config({path:'./src/config/.env'})
const express =require('express')
const app =express()
const uuid =require('uuid');
const date = require('date-and-time');
const redirectify = require('redirectify');
const bodyParser = express.json;
const mysql =require('mysql');
const mysqlconnection =require('express-myconnection');
const db=require('./src/config/db');
const session  =  require ( 'express-session' );
const cors = require('cors');
//const bcrypt = require('bcrypt');
let PORT=process.env.PORT || 5000

app.use(express.json());
app.use(cors())
app.use(mysqlconnection(db.Tbase,db.donnedeconnection,'pool'))
app.use(express.urlencoded({extended:false}))
//connection compte
app.use(session({
    name:process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge:1000*60*60*24,
        secure: false
    }

  }))
//recuperation db
app.get('/',(req,res)=>{
    //console.log(req.session.iduser)
    req.getConnection((error,connection)=>{
        if(error){
            res.status(404).json('erreur de connection')
        }else{
            connection.query('SELECT * FROM utilisateur',(error,resultat)=>{
                if(error){
                    res.status(404).json('erreur de commande')
                }else{
                    res.json(resultat)
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
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).json('erreur de connection avec la db')
        }else{
            const query = `INSERT INTO utilisateur(id_user, Nom, Prenom, Email, Motdepasse) VALUES (?, ?, ?, ?, ?)`;
            connection.query(query,[id,nom,prenom,email,motdepasse],(error,resultat)=>{
                if(error){
                    res.status(400).json(error.message)
                    //id =uuid.v4()
                }else{
                    res.status(200).json('inscription')
                }
            })
        }
    })
})
//connection
app.post('/connection', (req,res)=>{
    let email=req.body.email
    let motdepasse = req.body.motdepasse
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).json('erreur de connection avec la db')
        }else{
            connection.query("SELECT * FROM utilisateur WHERE Email = ? AND Motdepasse =? ",[email,motdepasse],(error,resultat)=>{
                if(error){
                    res.status(404).json('erreur de commande')
                }else{
                    resultat.length ===0? res.status(400).json('email ou mot de passe incorrecte'): req.session.iduser=resultat[0].id_user;res.status(200).json('connection')
                }
            })
        }
    })
})
//afficher une seul ong
app.get('/faireundon/:nom_ong',(req,res)=>{
    let id=req.params.id
    req.getConnection((error,connection)=>{
        if (error) {
            res.status(404).json('erreur de connection avec la db')
        }else{
            connection.query("SELECT * FROM ong WHERE id_ong = ? ",[id],(error,resultat)=>{
                if(error){
                    res.status(404).json('erreur de commande')
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
            res.status(404).json('erreur de connection avec la db')
        }else{
            connection.query(`SELECT * FROM ong WHERE Nom_ong LIKE '%${lettre}%'`,(error,resultat)=>{
                if(error){
                    res.status(404).json('erreur de commande')
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
            res.status(404).json('erreur de connection avec la db')
        }else{
            connection.query(`SELECT * FROM ong WHERE Domaine_ong =?`,[categorie],(error,resultat)=>{
                if(error){
                    res.status(404).json('erreur de commande')
                }else{
                   res.status(201).json(resultat)
                }
            })
        }
    })
})
//faire un don materiel
app.post('/don/materiel/:nom_ong',(req,res)=>{
    let id_ong =req.params.id
    let categorie=req.body.categorie
    let query = "INSERT INTO aide(id_user, id_ong, type_aide, categorie, date_aide) VALUES (?, ?, ?, ?, ?)";
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).json('erreur de connection avec la db')
        }else{
            
            connection.query(query,[id,id_ong,'materiel',categorie,date.format(new Date(), 'DD-MM-YYYY')],(error,resultat)=>{
                if(error){
                    res.status(404).json('error')
                }else{
                    res.status(200).json('merci pour votre don')
                }
            })
        }
    })
})

//faire un don en argent
app.post('/don/argent/:nom_ong',(req,res)=>{
    let id_ong =req.params.id
    let montant=req.body.montant
    let query = "INSERT INTO aide(id_user, id_ong, type_aide, montant, date_aide) VALUES (?, ?, ?, ?, ?)";
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).json('erreur de connection avec la db')
        }else{
            
            connection.query(query,[id,id_ong,'financier',montant,date.format(new Date(), 'DD-MM-YYYY')],(error,resultat)=>{
                if(error){
                    res.status(404).json('error')
                }else{
                    res.status(200).json('merci pour votre don')
                }
            })
        }
    })
})

//Mon compte
app.get('/moncompte',(req,res)=>{
    req.getConnection((error,connection)=>{
        if(error){
            res.status(500).json('erreur de connection')
        }else{
            if(req.session.iduser){
                connection.query('SELECT date_aide,montant,type_aide,Nom_ong FROM aider WHERE id_user = ?',[req.session.iduser],(error,resultat)=>{
                    if(error){
                        res.status(500).json('commande invalide')
                    }else{
                        res.status(200).json(resultat)
                    }
                })}
            else{
                res.status(400).json('pas de connection en cours')
            }

            }
    })
})
//deconnection
app.get('/deconnection',(req,res)=>{
    req.session.destroy((err)=>{
        res.clearCookie(process.env.SESSION_NAME)
        res.json('deconnecter')
    })
})

//payement avec paytech

//implementation de yango deli

//scrapping des association caritative


app.listen(PORT)
