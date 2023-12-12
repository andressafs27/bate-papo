import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const porta = 3000;
const host = '0.0.0.0';

var listaUsuarios = [];
var listaMensagens = [];

function processarEnvioMensagem(requisicao, resposta) {
    const dados = requisicao.body;
    let conteudoResposta = '';

    if(!(dados.mensagem)){
    conteudoResposta = 
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Bate Papo</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link rel='stylesheet' type='text/css' media='screen' href='main.css'>

        <style>
            body {
                background-color: #6B240C;
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
            }

            input{
                border:1px solid black;
                background-color: #b67951;
                border-radius: 5px;
                width: 50%;
                margin-bottom: 10px;
                padding: 10px;
                color: white;
                margin-top: 10px;
                
                
            }

            button{
                border:1px solid black;
                font-size: 14px;
                color: black;
                background-color: #A6FF96;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px;

            }
        
            select{
                border-radius: 5px;
                padding: 10px;
                background-color: #F5CCA0;
                margin-left: 5px;
            }

            a{
                border:1px solid black;
                font-size: 14px;
                color: black;
                background-color: #FF6666;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px; 
                text-decoration: none;
            }

        </style>
    </head>
    <body>
        <form id="form-enviar" action="/enviar" method="POST" class="needs-validation" novalidate>
            <select id='usuarionome' name='usuarionome' ><option>Andressa</option>`;
            listaUsuarios.forEach((usuario) => {
                conteudoResposta += `
                        <option>${usuario.nome}</option>`
                    });
            conteudoResposta += `
            </select>
            <input type="text"  id="mensagem" name="mensagem" placeholder="digite aqui sua mensagem" required>   
            <button type="submit">Enviar</button>  
            <a href="logout">Logout</a>
            <div>
                <p style="color: yellow" >O campo Mensagem é obrigatório</p>
            </div>
            </br>`;
            listaMensagens.forEach((mensagem) => {
                conteudoResposta += `
                        </br>
                        <span style="color:#A6FF96; font-size: 15px">${mensagem.usuario}: ${mensagem.texto}</span>
                        </br>
                        <span style="color:#F5CCA0; font-size: 10px">Enviado as ${mensagem.dataEnvio}</span>
                        </br>
                        `;
                        
            });
            conteudoResposta += 
            `        
        </form>
        
    </body>
    </html>
    `;
    resposta.end(conteudoResposta);
    }
    else{
        const data = new Date();
        const mensagem = {
            texto: dados.mensagem,
            usuario: dados.usuarionome,
            dataEnvio: data.toLocaleTimeString()
        }

        listaMensagens.push(mensagem);
        conteudoResposta = 
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Bate Papo</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
       
        <style>
            body {
                background-color: #6B240C;
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
            }

            input{
                border:1px solid black;
                background-color: #b67951;
                border-radius: 5px;
                width: 50%;
                margin-bottom: 10px;
                padding: 10px;
                color: white;
                margin-top: 10px;
                
            }

            button{
                font-size: 14px;
                color: black;
                background-color: #A6FF96;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px;

            }
        
            select{
                border-radius: 5px;
                padding: 10px;
                background-color: #F5CCA0;
                margin-left: 5px;
            }

            span{
                margin:10px;
            }

            a{
                border:1px solid black;
                font-size: 14px;
                color: black;
                background-color: #FF6666;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px; 
                text-decoration: none;
            }

            
        </style>
    </head>
    <body>
        <form id="form-enviar" action="/enviar" method="POST" class="needs-validation" novalidate>
        <select id='usuarionome' name='usuarionome'>
        <option>Andressa</option>`;
        listaUsuarios.forEach((usuario) => {
            conteudoResposta += `
                    <option>${usuario.nome}</option>`
                });
        conteudoResposta += `
        </select>
            <input type="text"  id="mensagem" name="mensagem" placeholder="digite aqui sua mensagem" required>
            <button type="submit">Enviar</button>
            <a href="logout">Logout</a>
            </br>
            `;   
            listaMensagens.forEach((mensagem) => {
                conteudoResposta += `
                        </br>
                        <span style="color:#A6FF96; font-size: 15px">${mensagem.usuario}: ${mensagem.texto}</span>
                        </br>
                        <span style="color:#F5CCA0; font-size: 10px">Enviado as ${mensagem.dataEnvio}</span>
                        </br>`;
            });
        conteudoResposta += 
            `        
                
        </form>
        
    </body>
    </html>
    `;
   
    resposta.end(conteudoResposta);
    }
}


function processarCadastroUsuario(requisicao, resposta) 
{
    const dados = requisicao.body;
    let conteudoResposta = '';

    if(!(dados.nome && dados.apelido &&dados.email && dados.nascimento && dados.pais && dados.senha))
    {
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Cadastro para Sala de Bate Papo</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
            <style>
                body {
                    background-color: #6B240C;
                    margin: 0;
                    padding: 0;
                    background-size: cover; 
                    background-position: center;
                    background-repeat: no-repeat;
                    font-family: Arial, Helvetica, sans-serif;
                }
        
                label{
                    font-size: 15px;
                    color: black;
                    margin-top: 20px;
                }
        
                input{
                    border:1px solid black;
                    background-color: #b67951;
                    border-radius: 5px;
                    width: 100%;
                    margin-bottom: 10px;
                    padding: 5px;
                }
        
                button{
                    font-size: 14px;
                    color: black;
                    background-color: #F5CCA0;
                    border:none;
                    padding: 8px 15px;
                    align-self: flex-start;
                    float:right;
                    border-radius: 5px;
                }
        
                form{
                    border: none;
                    background-color: #b67951;
                    padding: 50px;
                    display: block;
                    flex-direction: column;
                }
        
                legend {
                    font-size: 24px;
                    text-align: center;
                    color: #F5CCA0;
                }
        
                .container {
                    margin-top: 50px;
                }
    
            </style>
        </head>
        <body>
            <div class="container">
                <fieldset>
                    <legend>
                        <h1>Cadastro de Usuário</h1>
                    </legend>
                    <form id="formulario" action="/cadastra" method="POST" class="needs-validation" novalidate>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="nome">Nome</label>
                                <input type="text" id="nome" name="nome" placeholder="Nome" value="${dados.nome}" required>
                            <div> 
                            
        `;
        // if(!dados.nome){
        //     conteudoResposta += 
        //     `
        //                     <div>
        //                         <p style="color: yellow ; font-size:10px" >O campo nome é obrigatório, por favor insira o nome</p>
        //                     </div>
                            
        //     `;
        // }
        conteudoResposta += `
                            <div class="form-group col-md-6">
                                <label for="apelido">Nickname</label>
                                <input type="text" id="apelido" name="apelido" placeholder="Apelido" value="${dados.apelido}" required>
                            </div>
                        </div>
        `;
        // if(!dados.apelido){
        //     conteudoResposta += `
        //                     <div>
        //                         <p style="color: yellow ; font-size:10px">O campo Nickname é obrigatório, por favor insira o seu apelido</p>
        //                     </div>
        //                         `;
        // }

        conteudoResposta += `
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="nascimento">Data de Nascimento</label>
                                    <input type="text" id="nascimento" name="nascimento" required>
                                </div>
                    
        `;
        // if(!dados.nascimento){
        //             `
        //                         <div>
        //                             <p style="color: yellow ; font-size:10px">O campo Data de Nascimento é obrigatório, por favor insira</p>
        //                         </div>
        //             `;
        // }

        conteudoResposta += `
                                <div class="form-group col-md-6">
                                    <label for="pais">País</label>
                                    <input type="text"  id="pais" name="pais" placeholder="País" required>
                                </div>
                            </div>
                    
        `;
        // if(!dados.pais){
        //             `
        //                     <div>
        //                         <p style="color: yellow ; font-size:10px">O campo País é obrigatório, por favor insira</p>
        //                     </div>
        //             `;
        // }

        conteudoResposta += `
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="email">E-mail</label>
                                    <input type="text"  id="inputEmail4" name="email" placeholder="E-mail" value="${dados.email}" required>
                                </div>
                            
        `;
        // if(!dados.email){
        //     conteudoResposta += `
        //                         <div>
        //                             <p style="color: yellow ; font-size:10px">O campo Data de E-mail é obrigatória, por favor insira</p>
        //                         </div>
        //                         `;
        //}
        conteudoResposta += `
                                <div class="form-group col-md-6">
                                    <label for="inputPassword4">Senha</label>
                                    <input type="password" id="inputPassword4" name="senha" placeholder="Senha" value="${dados.senha}" required>
                                </div>
                            </div>
                            
        `;
        // if(!dados.senha){
        //     conteudoResposta += `
        //                         <div>
        //                             <p style="color: yellow ; font-size:10px">O campo senha é obrigatório, por favor insira o senha</p>
        //                         </div>
        //                         `;
        // }

     
        conteudoResposta +=
            `
            <div>
                <p style="color: yellow ; font-size:10px">Existem campos em branco por favor preencher</p>
            </div>
        `;
    
        
        conteudoResposta += `
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                    </form>
                </fieldset>
            </div>
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        </body>
        </html>
        `;
        resposta.end(conteudoResposta);
    }
    else
    {
        const usuario = {
            nome: dados.nome,
            apelido: dados.apelido,
            nascimento: dados.nascimento,
            pais: dados.pais,
            email: dados.email,
            senha: dados.senha,
        }

        listaUsuarios.push(usuario);
        conteudoResposta = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <!-- Restante do cabeçalho -->
                    <style>
                        /* Estilos para a tabela de usuários cadastrados */
                        body {
                            background-color: #6B240C;
                            font-family: Arial, Helvetica, sans-serif;
                        }
                
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 20px 0;
                            background-color:#b67951;
                        }

                        table, th, td {
                            border: 1px solid black;
                        }

                        th{
                            text-align:center;
                            padding: 10px;
                        }

                        td {
                            padding: 10px;
                            text-align: left;
                        }

                        thead {
                            background-color: #b6795;
                            color: #F5CCA0;
                        }

                        /* Estilos para os botões */
                        a {
                            display: inline-block;
                            padding: 10px 20px;
                            margin: 10px;
                            background-color: #F5CCA0;
                            color: black;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            border:1px solid #F5CCA0;
                            float:right;
                        }


                        h1{
                            font-size: 24px;
                            text-align: center;
                            color:#F5CCA0;
                        }

                    </style>
                
                </head>
                <body>
                    <h1>Usuários Cadastrados</h1>
                    <table>
                        <!-- Tabela de usuários cadastrados -->
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Nickname</th>
                                <th>Data de Nascimento</th>
                                <th>País</th>
                                <th>E-mail</th>
                            </tr>
                        </thead>
                        <tbody>`;

                        listaUsuarios.forEach((usuario) => {
                            conteudoResposta += `
                                <tr>
                                    <td>${usuario.nome}</td>
                                    <td>${usuario.apelido}</td>
                                    <td>${usuario.nascimento}</td>
                                    <td>${usuario.pais}</td>
                                    <td>${usuario.email}</td>
                                </tr>`;
                        });
        
                        conteudoResposta += `

                    </table>
                        <a href="/" >Voltar ao Menu Anterior</a>
                        <a href="/cadastra.html">Continuar Cadastrando</a>
                </body>
            </html>`;
        
        resposta.end(conteudoResposta);
    }
}

function autenticar(requisicao, resposta, next){
   if(requisicao.session.usuarioAutenticado){
    next();
   } 
   else{
    resposta.redirect("/login.html");
   }
}

const app = express();
app.use(cookieParser());
app.use(session({
    secret: "palavraSecreta",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 30
    }
}));

app.use(express.urlencoded({extend: true}));
//app.use(express.static('./paginas'));
app.use(express.static(path.join(process.cwd(), 'paginas')));
//app.use(express.static(path.join(process.cwd(),'./paginas')));

app.get('/batepapo',autenticar, (requisicao, resposta) => {
    var conteudoResposta = 
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Bate Papo</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
        <style>
            body {
                background-color: #6B240C;
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
            }

            input{
                border:1px solid black;
                background-color: #b67951;
                border-radius: 5px;
                width: 50%;
                margin-bottom: 10px;
                padding: 10px;
                color: white;
                margin-top: 10px;
               
            }

            button{
                font-size: 14px;
                color: black;
                background-color: #A6FF96;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px;

            }
        
            select{
                border-radius: 5px;
                padding: 10px;
                background-color: #F5CCA0;
                margin-left: 5px;
            }

            a{
                border:1px solid black;
                font-size: 14px;
                color: black;
                background-color: #FF6666;
                border:none;
                padding: 8px 15px;
                align-self: flex-start;
                border-radius: 5px; 
                text-decoration: none;
            }

            
        </style>
    </head>
    <body>
        <form id="form-enviar" action="/enviar" method="POST" class="needs-validation" novalidate>
        <select id='usuarionome' name="usuarionome"><option>Andressa</option>`;
        listaUsuarios.forEach((usuario) => {
            conteudoResposta += `
                    <option>${usuario.nome}</option>`
                });
        conteudoResposta += `
        </select>
            <input type="text"  id="mensagem" name="mensagem" placeholder="digite aqui sua mensagem" required>
            <button type="submit">Enviar</button>
            <a href="logout">Logout</a>
            </br>
            `;   
            listaMensagens.forEach((mensagem) => {
                conteudoResposta += `
                        </br>
                        <span style="color:#A6FF96; font-size: 15px">${mensagem.usuario}: ${mensagem.texto}</span>
                        </br>
                        <span style="color:#F5CCA0; font-size: 10px">Enviado as ${mensagem.dataEnvio}</span>
                        </br>`;
            });
        conteudoResposta += 
            `            
        </form>
        
    </body>
    </html>
    `;
   
    resposta.end(conteudoResposta);
});

app.get('/',autenticar, (requisicao, resposta) => {
    const DataUltimoAcesso = requisicao.cookies.DataUltimoAcesso;
    const data = new Date();
    resposta.cookie("DataUltimoAcesso", data.toLocaleTimeString(), {maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly: true});
    resposta.end(
        `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <title>Cadastro para Sala de Bate Papo</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <style>

                    body {
                        background-color: #6B240C;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    h1 {
                        color: #F5CCA0; 
                        font-size: 24px; 
                        text-align: center;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    a{
                        border:1px solid #b67951;
                        background-color: #b67951;
                        border-radius: 5px;
                        text-decoration: none;
                        color: black;
                        font-weight: bold;
                        text-align:center;
                        padding: 8px;
                    }
                    
                    ul {
                        list-style-type: none; 
                    }

                    li {
                        margin-bottom: 10px; 
                    }

                    p{
                        color: #F5CCA0; 
                        font-size: 24px; 
                        text-align: right;
                        margin-bottom: 20px;
                        font-family: Arial, Helvetica, sans-serif;
                        height:20%;
                    }
                </style>
        
            </head>
            <body>
                <h1>Menu</h1>
                <ul>
                    <li><a href="cadastra.html">Cadastrar Usuário</a></li>
                    </br>
                    <li><a href="batepapo">Bate Papo</a></li>
                </ul>
            </body>
            <footer>
                <p>Seu último acesso foi em ${DataUltimoAcesso}</p>
            </footer>
        </html>
    `
    )
});

app.post('/login', (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario && senha && (usuario === 'andressa') && (senha === '123')){
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/');
    }
    else{
        resposta.end(
        `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                    <title>Erro de Acesso</title>
                    <meta name='viewport' content='width=device-width, initial-scale=1'>
                    <style>
                        body {
                            text-align:center;
                            color:#F5CCA0;
                            background-color: #6B240C;
                            font-family: Arial, Helvetica, sans-serif;
                        }

                        a{
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 14px;
                            color: black;
                            background-color: #F5CCA0;
                            border:none;
                            text-decoration:none;
                            padding: 8px 15px;
                            align-self: flex-start;
                        }

                    </style>
                </head>
                    <body>
                        <h1>Usuário ou Senha Inválidos</h1>
                        <a href="/login.html">Voltar ao Login</a>
                    </body>
            </html>
        `
        )
    }
});


app.get('/logout', (requisicao, resposta) => {
        requisicao.session.usuarioAutenticado = false;
        resposta.redirect("/login.html");
    });

app.post('/cadastra.html', (requisicao, resposta) => {
    resposta.sendFile(__dirname + '/paginas/cadastra.html');
});


app.post('/cadastra',autenticar, processarCadastroUsuario);
app.post('/enviar',autenticar, processarEnvioMensagem);

app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});