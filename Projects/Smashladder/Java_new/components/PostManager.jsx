import {TimeElement} from 'TimeElement.jsx';
import {UsernameElement} from 'UsernameElement.jsx';
import {LadderLinker} from 'LadderLinker.jsx';
import {Html} from 'Html.jsx';
import {Users} from '../app/matchmaking.jsx';

export var PostManager = function(dynamicPostsGroup){

    this.dynamicPostsGroup = dynamicPostsGroup;
    this.noPosts = dynamicPostsGroup.find('.no_posts_at_all');
    this.topics = dynamicPostsGroup.find('.wall_posts_display');
    this.parseTopics();

    var scroller = new PostScrollLoader(dynamicPostsGroup.find('.wall_posts:first'));

    var scrollUpdateCheck = function () {
        var assetArea = dynamicPostsGroup.find('.wall_posts:first');
        if (!assetArea.length || !assetArea.is(':visible')) {
            return;
        }
        var assetAreaBottom = assetArea.position().top + assetArea.innerHeight();
        var windowBottom = $(window).scrollTop() + $(window).innerHeight();

        if (windowBottom + 120 >= assetAreaBottom) {
            scroller.loadMore();
        }
    };
    $(window).scroll(scrollUpdateCheck);

    var dynamicPosts = dynamicPostsGroup.on('submit', '.reply_to_post', function (e) {
        e.preventDefault();
        var form = $(this).closest('form');
        var data = form.serializeArray();
        var message = form.find('textarea').val();
        var buttons = form.find('textarea, button').prop('disabled', true);

        var postIdInput = form.find('input[name=post_id]');
        var postId = null;
        if (postIdInput.length) {
            postId = postIdInput.val();
        }

        data.push({name:'json',value:1});

        $.post(form.attr('action'), data).done( function (response) {
            buttons.prop('disabled', false);
            if (response.success) {
                var reply = new WallPostReply(response.reply);
                if (!postId) {
                    form.find('textarea').val('');
                }
                $.each(response.replies, function (i, replyData) {
                    new WallPostReply(replyData).place();
                });
                reply.place();
            }
            else {
                if (response.errors && response.errors.content) {
                    alert(response.errors.content);
                }
                else {
                    if(response.error)
                    {
                        alert(response.error);
                    }
                    else
                    {
                        alert('There was an error saving, sorry!');
                    }
                }
            }
        }).error(function(response){
            var data = JSON.parse(response.responseText);
            if(response.status == 403 && data)
            {
                alert('You may have been logged out, Sorry!');
            }
            else{
                alert('There was an error saving, sorry!');
            }
        });
    }).on('click', '.delete_post', function (e) {
        var doIt = confirm('Remove this post?');
        if (!doIt) {
            return false;
        }
        var form = $(this).closest('form');
        var data = form.serializeArray();
        var post = $(this).closest('.wall_post_reply');
        if (!post.length) {
            post = $(this).closest('.wall_post');
        }
        post.fadeTo('fast', .6);
        $.post(siteUrl + '/posts/delete_post', data, function (response) {
            if (!response.success) {
                if (response.error) {
                    alert(response.error);
                }
                else {
                    alert('There was an error deleting this post, please try again later');
                }

                post.fadeTo('fast', 1);
            }
            else {
                post.hide();
            }
        });
    }).on('click', '.edit_post', function (e) {
        var reply = $(this).closest('.editable-toggle');
        if (reply.hasClass('editing')) {
            reply.removeClass('editing');
        }
        else {
            reply.addClass('editing');
        }
    }).on('click', '.reply-toggle', function (e) {
        e.preventDefault();
        var replies = $(this).closest('.replies-list');
        var button = $(this);
        if (replies.hasClass('opened')) {
            replies.removeClass('opened').addClass('closed');
        }
        else {
            var replyHolder = replies.find('.replies');
            button.prop('disabled', true);
            $.post(siteUrl + '/posts/get_replies', {get_replies: button.data('post_id')}, function (response) {
                button.prop('disabled', false);
                replies.removeClass('closed').addClass('opened');
                if (response.success) {
                    replyHolder.data('replies', response.replies);
                    $.each(response.replies, function (i, replyData) {
                        new WallPostReply(replyData).place();
                    });
                }
            });
        }
    });
    dynamicPosts.find('.reply_to_post .wall_post_content').elastic();
};
PostManager.prototype.parseTopics = function(){
    var allReplies = this.topics.data('topics');
    if(allReplies)
    {
        if (this.noPosts.length) {
            this.noPosts.remove();
        }
    }

    $.each(allReplies, function(i, replyData){
        var helper = new WallPostReply(replyData);
        var created = helper.place();

        if(replyData.id == postOnLoadHelper.post || replyData.id == postOnLoadHelper.parent)
        {
            setTimeout(function(){
                $('body').scrollTop(created.offset().top - $('.header').height() - 20);
                created.addClass('the_focus');
                if(postOnLoadHelper.post != replyData.id)
                {
                    created.find('.reply-toggle').not('.opened').trigger('click');
                }
            },100);
        }
    })
};

var PostScrollLoader = function (mainElement) {
    var instance = this;
    this.element = mainElement;
    this.currentPage = 1;
    this.itemsShown = null;
    this.isLoadingMore = false;
    this.loadedAll = false;


    this.loadMore = function () {
        if (this.loadedAll || this.isLoadingMore) {
            return;
        }
        var loadingDiv = $('<div>').addClass('loading-more-container');
        var loadingMoreLoader =
            $('<img>').attr('src', siteUrl + '/images/ajax-loader-long.gif').addClass('loading-more');
        loadingDiv.append(loadingMoreLoader);
        loadingDiv.appendTo(this.element);
        this.isLoadingMore = true;
        this.lastItem = mainElement.find('.wall_post:last');
        this.element.addClass('loading_more');

        var data = {};
        data.last_loaded_post = this.lastItem.data('post_id');
        $.post(siteUrl + '/posts/load_more', data, function (response) {
            instance.isLoadingMore = false;
            loadingDiv.remove();
            if (response.posts && response.posts.length) {
                $.each(response.posts, function (i, replyData) {
                    var helper = new WallPostReply(replyData);
                    helper.place();
                });
            }
            else {
                instance.loadedAll = true;
            }
        });
    };
};
var WallPostReply = function (data) {
    this.data = data;

    this.update = function (element) {
        var data = this.data;
        element.attr('id', 'site_post_' + data.id).data('post_id', data.id);

        TimeElement.populate(element.find('time'), data.time);
        if(data.deleted)
        {
            element.addClass('post-deleted');
        }
        else
        {
            element.removeClass('post-deleted');
        }

        if (data.permissions) {
            var permissions = data.permissions;
            if (permissions.reply) {
                element.addClass('post-replyable');
            }
            if (permissions.edit) {
                element.addClass('post-editable');

            }
            if (permissions.delete) {
                element.addClass('post-deletable');
            }

        }

        data.sender = Users.update(data.sender);
        data.sender.updateUserElements(element.find('.username'));
        var repliesList = element.find('.replies-list');
        if (data.parent_post_id) {
//                element.removeClass('wall_post_reply').addClass('wall_post');
            repliesList.remove();
        }
        else {
            var replies = data.replies;
            var replyToggleButton = element.find('.reply-toggle');
            replyToggleButton.data('post_id', data.id);
            element.find('input[name=parent_post_id]').val(data.id);
            if ((replies && replies.length) || data.replies_count || true) {
                var total = replies ? replies.length : data.replies_count;
                replyToggleButton.find('.replies_number').text(total);
                replyToggleButton.find('.replies_word').text(total == 1 ? 'Reply' : 'Replies');
                if (replies)
                    element.find('.replies').data('replies', replies);
            }
            else {
                element.find('.entries').hide();
                repliesList.removeClass('closed').addClass('opened');
            }
            element.removeClass('wall_post_reply').addClass('wall_post')
                .addClass('panel');
        }
        element.find('input[name=post_id]').val(data.id);

        element.find('.response').html(Autolinker.link(Html.encode(data.content),LadderLinker.autolinkerOptions));

        element.find('> .edit_mode textarea').text(data.content);
        return element;
    };
    this.create = function () {
        var data = this.data;
        var template = WallPostReply.template.clone().removeClass('template');
        this.update(template);
        return template;
    };
    this.place = function () {
        $('.no_posts_at_all').remove(); //Todo make this specific!
        var preexisting = $('#site_post_' + this.data.id);
        if (preexisting.length) {
            var toggle = preexisting;
            if (!preexisting.hasClass('editable-toggle'))
                toggle = preexisting.find('.editable-toggle');
            toggle.removeClass('editing');
            this.update(preexisting);
            return preexisting;
        }
        if (this.data.parent_post_id) {
            var parent = $('#site_post_' + this.data.parent_post_id);
            parent.find('.entries').show();
            created = this.create();
            parent.closest('.wall_post').find('.replies-list .replies').append(created);
            created.find('textarea').elastic();
            return parent;
        }
        else {
            var created;
            if (this.data.new) {
                created = this.create();
                $('.wall_posts_display .wall_posts').prepend(created);
                created.find('textarea').elastic();
                return created;
            }
            else {
                created = this.create();
                $('.wall_posts_display .wall_posts').append(created);
                created.find('textarea').elastic();
                return created;
            }
        }
    };
};
WallPostReply.template = $('.wall_post_reply.template');


/** WEBPACK FOOTER **
 ** ./../components/PostManager.jsx
 **/