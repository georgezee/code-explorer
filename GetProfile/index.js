module.exports = async function (context, req) {
  context.log('Code Explorer starts here.');
  context.res = {
      status: 200,
      body: "Hello Code Explorer!"
  };
};