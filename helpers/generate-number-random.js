const generateCodeRandom = () => {
     const max = 9999;
     const min = 1000;
     
     return Math.floor((Math.random() * (max-min)) +min);
}

module.exports = {
     generateCodeRandom,
}