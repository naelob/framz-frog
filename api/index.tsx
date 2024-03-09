import { Button, Frog } from 'frog'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { getConnectedAddressForUser } from '../utils/fc.js'
import { balanceOf, mintNft } from '../utils/mint.js'
import axios from 'axios'

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  //hub: neynar({ apiKey: "NEYNAR_FROG_FM" }) /*'4E7D8D08-82FB-48B8-B2C6-2F83EE687E04'*/
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
      const result = await axios.post(
        `http://45.55.192.244:3000/api/v2/auth-v2/player/farcaster/login`,
          {
            message: "0a59080d10a1b01418f9a8e72f20018201490a2968747470733a2f2f70696e6174612d6672616d652d73646b2e76657263656c2e6170702f6672616d6510011a1a08a1b0141214000000000000000000000000000000000000000112147b000b06ef4e9639328687988f4153d366ecf1d5180122401d074cc89590bde4dcfa2c03da7ad187ade2604111ade9163268aecdcef0a4b23ffa52e070414865d25e67a60b1e3ac1d6968c8da8ef37fc27f2def5ed0bd20b280132201ba8c4ee4a329c544f78658664c088c880a1a6520212fae05bb9acf74f7ed8e7",
            address: address,
            fid: "333857",
          },
          {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`result is ${JSON.stringify(result.data)}`)

      if (result.status !== 201) {
        const errorBody = result.statusText; 
          throw new Error(
          `Fetch to login-farcaster failed: ${result.status} ${errorBody}`
        );
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
