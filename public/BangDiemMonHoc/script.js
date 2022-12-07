async function submit() {
   
    var form = document.querySelector("#formElem");
    
    data = {
        data : form.querySelector('input[name="HoVaTen"]').value,
    }
  
    let url = window.location.href;
    console.log(data)
    console.log(url)
  
    let response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            json: true
    })
  
    let text = await response.json(); 
    console.log(text)
  };