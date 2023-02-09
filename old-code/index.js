url = '/api/davinci'

async function handleSubmit() {
	const prompt = document.getElementById('text').value;
	if (!text) alert('debe ingresar una oración')


	const headers = {
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Methods':'*'
	}
	const data = {
		prompt: prompt
	}

	const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

	res2 = await response.json();

	console.log('front#res2', res2);

	document.getElementById('prediction').innerText = res2.message;

}