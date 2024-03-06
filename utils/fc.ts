export const getConnectedAddressForUser = async (
    fid: number,
    buttonIndex: number
  ) => {
    const res = await fetch(
      `https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`
    );
    const json = await res.json();
    const address =
      json.messages[buttonIndex].data.verificationAddAddressBody.address;
    return address;
  };
  