import { Button, Frog } from 'frog'
import { pinata, neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { getConnectedAddressForUser } from '../utils/fc.js'
import { balanceOf, mintNft } from '../utils/mint.js'

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  //hub: neynar({ apiKey: "NEYNAR_FROG_FM" }) /*'4E7D8D08-82FB-48B8-B2C6-2F83EE687E04'*/
  hub: pinata()
})


app.frame('/', async (c) => {
  const { buttonIndex, frameData, status, verified } = c
  console.log("verified ? "+ verified)
  console.log("frame data is "+ JSON.stringify(frameData))
  if(status == "response"){
    //const { fid } = frameData!
    const address = await getConnectedAddressForUser(333857, buttonIndex! - 1);
    
    if(!address){
      return c.res({
        action: '/',
        image: "https://sgp1.digitaloceanspaces.com/ggquestfiles/frames/qid_connect_tryagain_720.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00RYMGYFQXVB448MHE%2F20240303%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20240303T044122Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=50f5fafaf4773d686ca47354511f76122d398772cfc39ff1c3fd07594b35d2c4",
        intents: [
          <Button>Try Again</Button>,
        ]
      })
    }
  
    const balance = await balanceOf(address);
    if (typeof balance === "number" && balance !== null && balance < 1) {
      const hash = await mintNft(address);
  
      if (!hash) {
        return c.res({
          action: '/',
          image: "https://sgp1.digitaloceanspaces.com/ggquestfiles/frames/qid_connect_tryagain_720.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00RYMGYFQXVB448MHE%2F20240303%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20240303T044122Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=50f5fafaf4773d686ca47354511f76122d398772cfc39ff1c3fd07594b35d2c4",
          intents: [
            <Button>Try Again</Button>,
          ]
        })    
      }
      return c.res({
        action: '/',
        image: "https://sgp1.digitaloceanspaces.com/ggquestfiles/frames/qid_mint_success_720.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00RYMGYFQXVB448MHE%2F20240305%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20240305T112801Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=0d355165af557d6f08903106565d9be28af5ab1ebdb23a4178aaa4571fd2810e",
        intents: [
          <Button>QuestId minted !</Button>,
        ]
      })  
    }else{
      return c.res({
        action: '/',
        image: "https://ggquestfiles.sgp1.digitaloceanspaces.com/frames/qid_already_own_720.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00RYMGYFQXVB448MHE%2F20240303%2Fsgp1%2Fs3%2Faws4_request&X-Amz-Date=20240303T061524Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=81b7a4aad5b5c0f07935cab8c41f86452a348856d41b7cb2f7cfafc3cf230d95",
        intents: [
          <Button>Try Again</Button>,
        ]
      })
    }

  }
  
  return c.res({
    //action: '/submit',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Select your favorite fruit:
      </div>
    ),
    intents: [
      <Button value="apple">Apple</Button>,
      <Button value="banana">Banana</Button>,
      <Button value="mango">Mango</Button>
    ]
  })
})

app.frame('/submit', (c) => {
  const { buttonValue } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Selected: {buttonValue}
      </div>
    )
  })
})

/*app.frame('/', (c) => {
  return c.res({
    action: '/finish',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Perform a transaction
      </div>
    ),
    intents: [
      <Button.Transaction target="/mint">Mint your questID</Button.Transaction>,
    ]
  })
})


app.transaction('/mint', (c) => {
  const { inputText } = c
  // Contract transaction response.
  return c.contract({
    abi: contractAbi,
    chainId: 'eip155:421614',
    functionName: 'mintFor',
    args: [["0xfeec72d5153e5328fac8adea4be592ec15c9320a"]],
    to: '0x86EC48E29d4E19cEe73CCEAc0bEb3aF6E4fC9193',
  })
})

app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    )
  })
})
*/

export const GET = handle(app)
export const POST = handle(app)
