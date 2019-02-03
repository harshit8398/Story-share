const moment = require('moment');

module.exports = {
    truncate: function(str, len){
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: function(input){
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function(date, format){
        return moment(date).format(format);
    },
    select: function(selected, options){
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    editIcon: function(storyUser, loggedUser, storyId, floating = true){
        if(storyUser == loggedUser){
            if(floating){
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
            }
        } else {
            return '';
        }
    },
    liked: function(found,storyId){
                
                if(found == 'private'|| found == 'logged_out')
                {
                    return '';
                }    
                else if(found)
                {   
                    return `<button onclick="dislike()" class="btn-floating btn-large halfway-fab red"><i class="fa fa-thumbs-down"></i></button>`;
                }
                else{
                    return `<button onclick="like()" class="btn-floating btn-large halfway-fab red"><i class="fa fa-thumbs-up"></i></button>`;
                }  
            }    
}