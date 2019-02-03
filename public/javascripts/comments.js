	$('#send').click(function(){

	let comment = $('#comment').val();
	let storyId = $('#storyId').val();
	let user = $('#userId').val();
	let userImage = $('#userImage').val();
	let firstName = $('#firstName').val();
	let lastName = $('#lastName').val();

	$('#comment').val('');

	const userAction = async (data) => {
	console.log('data',data)
    const response = await fetch('/stories/addComment', {
    method: 'POST',
    body:JSON.stringify(data),
    headers:{
    'Content-Type': 'application/json'
   }
  })
   
   const myJson = await response.json();

   if(myJson.val)
	{
	$('#comments').append(`<div class="card">
                    <div class="card-content">
                        <div class="chip">
                            <img src="${userImage}">
                            <a href="/stories/user/${user}">
                                ${firstName} ${lastName}
                            </a>
                        </div>
                        <span class="comment-body">${comment}</span>
                        <br>
                    </div>  
                </div>`)
	}
}
	const data = {
		commentBody:comment,
		storyId:storyId		
	}

	userAction(data);
	})

