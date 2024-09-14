// pages/api/test.js
import nextConnect from 'next-connect';


const handler = nextConnect()
  .get((req, res) => {
    res.status(200).json({ message: 'Next Connect is working!' });
  });

export default handler;
