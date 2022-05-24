import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu,AlurakutProfileSidebarMenuDefault,OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { RelationshipBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(props) {
  
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px'}}/>
      <hr />

      <p> 
        <a className="boxlink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )

}

function ProfileRelationsBox(props) {
  return(
    <RelationshipBoxWrapper>
      <h2 className="smallTitle">
      {props.title} ({props.items.length})
      </h2>
      <ul>
        { /*props.items.map( (itemAtual) => {

          return (
            <li key={itemAtual}>
              <a href={`http://github.com/${itemAtual}.png`}>
                  <img src={itemAtual} />
                  <span>{itemAtual}</span>
              </a>
            </li>
          )

          }) */}
      </ul>
    </RelationshipBoxWrapper>
  );
}

export default function Home(props) {
  const githubUser = props.githubUser;

  const [comunidades,setComunidades] = React.useState([]);


  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores,setSeguidores] = React.useState([]);

  React.useEffect ( () => {
      fetch("https://api.github.com/users/peas/followers")
      .then( data => {
        return data.json();
      })
      .then( data => {
        setSeguidores(data);
      })

      fetch("https://graphql.datocms.com/", {
        method:'POST',
        headers: {
          'Authorization': 'd58098781380be99459923c1626a39',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({"query": `query {
          allCommunities {
            title
            id
            creatorSlug
            imageUrl
          }
        }` })

      })
      .then( (response) => response.json() )
      .then ( (respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato);
        console.log(comunidades);
      })
  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={ (e) => {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageURL: dadosDoForm.get('image'),
                creatorSlug:githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  "Content-Type":"application/json",
                },
                body: JSON.stringify(comunidade)
              })
              .then( async (response) => {
                const dados = await response.json();
                console.log( dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades,comunidade];
                setComunidades(comunidadesAtualizadas);
              })
            }}>

              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"/>
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL pra usarmos de capa"
                  name="image" 
                  aria-label="Coloque uma URL pra usarmos de capa"/>
              </div>

              <button>
                Criar comunidade
              </button>

            </form>
          </Box>
      </div>

      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>    

          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          <RelationshipBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map( (itemAtual) => {

                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )

              })}
            </ul>
          </RelationshipBoxWrapper>
          
          <RelationshipBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidades ({pessoasFavoritas.length})
            </h2>
          <ul>
            {pessoasFavoritas.map( (persons) => {

              return (
                <li key={persons}>
                  <a href={`https://github.com/${persons}`}>
                      <img src={`https://github.com/${persons}.png`} />
                      <span>{persons}</span>
                  </a>
                </li>
              )

            })}
          </ul>
          </RelationshipBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  //const { githubUser } = jwt.decode(token);
  console.log(jwt.decode(token))

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
    header: { 
      Authorization: token
    }
  })
  .then( (res) => res.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  
  return {
    props:{
      githubUser:"Paulo-dev2"
    },
  }
}
