import Moralis from 'moralis';

export const initializeMoralis = () => {
  Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
};

export default Moralis;
