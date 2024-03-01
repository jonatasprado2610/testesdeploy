import { alterarImagem, consultarFilmesId,  inserirFilme, listarTodosFilmes,  removerFilme, alterarFilme, buscarPorNome} from '../repository/filmeRepository.js';


import multer from 'multer' 

import { Router } from 'express';
import { con } from '../repository/connection.js';
const server = Router();

const upload = multer({ dest: 'storage/capaFilmes' })


server.post('/filme', async (req, resp) => {
    try {
        const novoFilme = req.body;

        if (!novoFilme.nome)
            throw new Error('Nome do filme é obrigatório!');
        
        if (!novoFilme.sinopse)
            throw new Error('Sinopse do filme é obrigatório!');
        
        if (novoFilme.avaliacao == undefined || novoFilme.avaliacao < 0)
            throw new Error('Avaliação do filme é obrigatória!');
    
        if (!novoFilme.lancamento)
            throw new Error('Lançamento do filme é obrigatório!');
        
        if (novoFilme.disponivel == undefined)
            throw new Error('Campo Disponível é obrigatório!');
        
        if (!novoFilme.usuario)
            throw new Error('Usuário não logado!');

        
        const filmeInserido = await inserirFilme(novoFilme);
        resp.send(filmeInserido);

    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/filme/:id/capa', upload.single('capa'), async (req, resp) => {
    try {
        if(!req.file ){
            throw new Error('Escolha a capa do Filme.');
        }

        const { id } = req.params;
        const imagem = req.file.path;

        const resposta = await alterarImagem(imagem, id);
        if (resposta != 1)
            throw new Error('A imagem não pode ser salva.');

        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get ('/filme' , async (req,resp) =>{
   try{
       const resposta = await listarTodosFilmes();
       resp.send(resposta);

   } catch(err){

    resp.status(400)({
        erro:err.message
    })
   }

})


server.get('/filme/busca', async (req, resp) => {
    try {
        const { nome } = req.query;
        
        const resposta = await buscarPorNome(nome);
        console.log(resposta);
        if (resposta.length == 0)
            resp.status(404).send([])
        else
            resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
  
})




server.get ('/filme/:id' , async (req,resp) =>{
    try{
        const id = Number( req.params.id);
        const resposta = await consultarFilmesId(id);
         
        if(!resposta)
          resp.status(404).send([])
        else
            resp.send(resposta);

      
    } catch(err){
 
     resp.status(400)({
         erro:err.message
     })
    }
    
 })

 server.delete('/filme/:id', async (req,resp) => {
     try{
           const { id } = req.params;

           const  resposta = await removerFilme(id);
           if(resposta!=1)
           throw new  Error('filme nao pode ser removido');

           
           
           resp.status(204).send();

     }catch(err){
 
     resp.status(400)({
         erro:err.message
     })
    }
 })

  server.put ('/filme/:id', async (req, resp)=>{
      try{
          const { id } = req.params;
          const filme  = req.body;

          if(!filme.nome)
          throw new Error('nome do filme e obriagatorio');
          if(!filme.sinopse)
          throw new Error('sinopse do filme e obriagatorio');
          if(!filme.avalicao ==undefined || filme.avalicao<0)
          throw new Error('avalição do filme e obriagatorio');
          if(!filme.lancamento)
          throw new Error('lancamento do filme e obriagatorio');
          if(filme.disponivel== undefined)
          throw new Error('disponivel do filme e obriagatorio');
          if(!filme.usuario)
          throw new Error('usauario  e obriagatorio');

          const resposta = await alterarFilme(id,filme);

          if(resposta !=1)
             throw new Error('fime nao pode ser alterado');
          else
          resp.status(204).send();  


      }catch(err){
 
        resp.status(400).send({
         erro:err.message
     })
    }
  })



export default server;


