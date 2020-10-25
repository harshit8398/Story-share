const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const Likes = mongoose.model('likes');

router.get('/', (req, res) => {
    Story.find({status:'public'})
        .populate('user')
        .sort({date:'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

router.get('/user/:userId',(req,res)=>{
    Story.find({user: req.params.userId,status:'public'})
        .populate('user')
        .then(stories=>{
            res.render('stories/index',{
                stories:stories
            });
        });
});


router.get('/my',ensureAuthenticated,(req,res)=>{
    Story.find({user: req.user.id})
        .populate('user')
        .then(stories=>{
            res.render('stories/index',{
                stories:stories
            });
        });
});


router.get('/add',ensureAuthenticated,(req,res)=>{

    res.render('stories/add');
});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
   Story.findOne({_id:req.params.id})
       .then(story=>{
           if(story.user != req.user.id){
               res.redirect('/stories');
           }else{
               res.render('stories/edit',{story:story});
           }
       });
});


router.post('/', (req, res) => {
    let allowComments;

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments:allowComments,
        user: req.user.id
    };

    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

router.get('/show/:id', (req, res) => {
    storyId = req.params.id;
    Story.findOne({
        _id: storyId
    })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {

            if(story.status == 'public'){
                if(req.user)
               {     
                 Likes.findOne(
                {
                   $and:[{userId:req.user.id},{storyId:storyId}] 
                })
                .then(like=>{
                    let found = false;
                    if(like)
                    {
                       found = true;
                    }
                      res.render('stories/show', {story:story,found:found})
                    })
                }
                else{
                    res.render('stories/show',{story:story,found:'logged_out'})
                }
            }
                        
             else {
                if(req.user){
                    if(req.user.id == story.user._id){
                        res.render('stories/show', {
                            story:story,found:'private'
                        });
                    } else {
                        res.redirect('/stories');
                    }
                }else{
                    res.redirect('/stories');
                }
            }
        });
});

router.put('/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
        .then(story=>{
            let allowComments;

            if(req.body.allowComments){
                allowComments = true;
            } else {
                allowComments = false;
            }
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;

            story.save()
        })
        .then(()=>{
                res.redirect('/dashboard');
        })
});


router.delete('/:id',(req,res)=>{
       Story.deleteOne({_id:req.params.id})
           .then(()=>{
             res.redirect('/dashboard');
           });
});

router.post('/addComment', (req, res) => {
    
        const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
        
        Story.findOne({
            _id: req.body.storyId
        })    
        .then(story=>{
            story.comments.push(newComment)
            story.save()
        })
        .then(()=>{
          res.send({val:true})  
        })
        .catch(err=>{
            console.log('error')
        })
});        

router.post('/like',(req,res)=>{
    const likes = {
                    userId:req.user.id,
                    storyId:req.body.storyId
                  } 

        new Likes(likes)
        .save()
        .then(()=>{
            return Story.findOne({_id:req.body.storyId})
        })
        .then(story=>{
            story.likes += 1;
            return story.save()
        })    
        .then((story)=>{ 
            res.send({liked:true,likeNumber:story.likes})
        })
        .catch(err=>{console.log(err)})
})       

router.post('/dislike',(req,res)=>{
    
    Likes.deleteOne(
        {
          $and:[{userId:req.user.id},{storyId:req.body.storyId}]  
        }
        )
        .then(()=>{
                return Story.findOne({_id:req.body.storyId})
            })
        .then(story=>{
                story.likes -= 1;
                return story.save()
        })
        .then((story)=>{
            res.send({disliked:true,likeNumber:story.likes})
        })
        .catch(err=>{console.log(err)})    
})  

module.exports = router;

