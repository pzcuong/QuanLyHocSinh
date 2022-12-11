async function XoaBaiDang(MaBaiDang) {
  let response = await fetch('/admin/XoaBaiDang', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({MaBaiDang: MaBaiDang}),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
    window.location.href = text.redirect;
  
  // delete the row
    var row = document.getElementById(MaBaiDang);
    row.parentNode.removeChild(row);
}