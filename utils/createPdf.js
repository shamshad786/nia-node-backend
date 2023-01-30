// const puppeteer = require('puppeteer')

createPdf = async (id) =>{
  //  var url = "http://localhost:3000/applicationpdf/"+id
  let url = `http://localhost:3000/applicationpdf/${id}`

  
    console.log("in create pdf",url);
    try{
        // const browser = await puppeteer.launch({ headless: true});
        // const webPage = await browser.newPage();
    
        await webPage.goto(url, {
            waitUntil: "networkidle0"
        });
        await webPage.pdf({path: id+'.pdf', format: 'A4'});
        return true
    }catch(err){
        console.log(err);
        return false
}  
// await browser.close();
}

module.exports = createPdf