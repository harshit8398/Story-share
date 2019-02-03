 
    let storyId = $('#storyId').val();

    let data = {
      storyId:storyId
    }

    const like = async ()=>{
      const response = await fetch('/stories/like',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json();

      if(json.liked)
      {
        if(json.likeNumber==0)
        {
          $('#like-number').text('');
        }
        else
        {
          $('#like-number').html(`<i class="fa fa-thumbs-up"></i> ${json.likeNumber} likes`);
        }
        $('#like-div').empty();
        $('#like-div').append('<button id="dislike" onclick="dislike()" class="btn-floating btn-large halfway-fab red"><i class="fa fa-thumbs-down"></i></button>');
      }
    }

     const dislike = async ()=>{
      const response = await fetch('/stories/dislike',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json();

      if(json.disliked)
      {
        if(json.likeNumber==0)
        {
          $('#like-number').text('');
        }
        else
        {
          $('#like-number').html(`<i class="fa fa-thumbs-up"></i> ${json.likeNumber} likes`);
        }
        $('#like-div').empty();
        $('#like-div').append('<button id="like" onclick="like()" class="btn-floating btn-large halfway-fab red"><i class="fa fa-thumbs-up"></i></button>')
      }
    }

