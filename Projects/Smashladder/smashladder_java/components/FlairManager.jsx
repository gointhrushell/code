"use strict";
import {Popups} from 'components/Popups.jsx';

$(function(){

    $('.group-select').on('click','.upload_to_folder',function(e){
        e.preventDefault();
        var data = {};
        data.folder_id = $(this).data('folder_id');
        data.upload_to_folder = 1;
        Popups.ajax(siteUrl+'/mod/flair-manager',data,function(){

        });
    });

    $('.flair_detail').on('submit','.flair_update_container',function(e){
        e.preventDefault();
        var loading = $(this).find('.loading');
        loading.show();
        var data = $(this).serializeArray();
        $.post('',data,function(response){
            loading.hide();
            if(response.error)
            {
                alert('error saving');
            }
        }).error(function(){
            loading.hide();
        });
    });

    var gameGroupSortableOptions = {
        tolerance: "pointer",
        items: ".sortable_folder",
        connectWith: '.game_group',
        placeholder: 'sortable-placeholder sortable_folder',
        start:function(e,ui){
            ui.placeholder.height(ui.item.height());

            ui.placeholder.attr('class',ui.item.attr('class'));
            ui.placeholder.addClass('sortable-placeholder sortable_folder');
        },
        update: function(e,ui){
            if (this !== ui.item.parent()[0]) {
                return;
            }
            var list = $(ui.item).closest('.game_group');
            var elements = list.find('.sortable_folder').not('.template');
            var ids = [];
            elements.each(function(){
                var element = $(this);
                var chat = element.data('folder_id');
                ids.push(chat);
            });
            var gameId = list.data('game_id');
            var data={game_id:gameId,folder_ids:ids,save_folder_order:1};
            $.post(siteUrl+'/mod/flair-manager',data,function(response){

            });
        }
    };
    var folderGroupSortableOptions = {
        tolerance: "pointer",
        items: ".flair_groupable",
        connectWith: ".folder_group",
        placeholder: 'sortable-placeholder flair_groupable',
        start:function(e,ui){
            ui.placeholder.height(ui.item.height());


        },
        update: function(e,ui){
            if (this !== ui.item.parent()[0]) {
                return;
            }
            var list = $(ui.item).closest('.folder_group');
            var elements = list.find('.flair_groupable').not('.template');
            var ids = [];
            elements.each(function(){
                var element = $(this);
                var chat = element.data('flair_id');
                ids.push(chat);
            });
            var folderId = list.data('folder_id');
            var data={folder_id:folderId,flair_ids:ids,save_flair_order:1};
            $.post(siteUrl+'/mod/flair-manager',data,function(response){

            });
        }
    };

    $('.group-select').on('click','.flair_groupable',function(){
        var button = $(this);
        var detail = $('.flair_detail');

        detail.find('input[name=flair_id]').val(button.data('flair_id'));
        var data={};
        data.flair_id = button.data('flair_id');
        data.load_flair_preview_thingy = 1;
        detail.show('fast');
        detail.addClass('loading');
        detail.empty();
        Popups.ajax(siteUrl+'/mod/flair-manager',data,function(){

        });
        return;
    });

    $('.group-select').on('click','.folder_title',function(e){
        var folderId = $(this).closest('.sortable_folder').data('folder_id');
        var title = $(this).find('input[name=text]').val();
        var titleArea = $(this);

        var others = $('.folder_title').not($(this));
        others.removeClass('active');
        $('.new_upload_form').find('.folder_helper').text(title);
        $('.new_upload_form input[name=flair_folder_id]').val(folderId);
    });

    $('.group-select').on('click','.edit_folder_button',function(e){
        var folder = $(this).closest('.sortable_folder');
        var selected = $('.sortable_folder').not(folder);
        selected.addClass('viewing');
        folder.removeClass('viewing');
    });

    $('.group-select').on('submit','.change_name_form',function(e){
        var folder = $(this).closest('.sortable_folder');
        e.preventDefault();
        var data = $(this).serializeArray();
        var form = $(this);
        form.addClass('spinner');
        form.find(':input').prop('disabled',true);
        var finished = function(){
            form.find(':input').prop('disabled',false);
            form.removeClass('spinner');
            folder.addClass('viewing');
            folder.find('.group_name').text(form.find('input[name=text]').val());
        };
        $.post('',data,function(response){
            if(!response.success)
            {
                alert('error saving!');
            }
            finished();
        }).error(function(){
            finished();
        });
    });
    $('.group-select').on('change','input[name=folder_enabled]',function(e){
        var form = $(this).closest('form');
        var data = form.serializeArray();

        var button = $(this);
        button.addClass('spinner');
        var finished = function(){
            var group = button.closest('.sortable_folder');
            console.log(group);
            button.removeClass('spinner');
            if(button.is(':checked'))
            {
                group.addClass('enabled');
            }
            else
            {
                group.removeClass('enabled');
            }
        };
        $.post('',data,function(response){
            if(!response.success)
            {
                alert('error saving!');
            }
            finished();
        }).error(function(e){
            finished();
        });
    });



    $('.group-select .game_group_select').change(function(e){
        var select = $(this);
        var groupSelect = $(this).closest('.group-select');
        var gameId = select.val();
        var groupArea = select.closest('.group-select').find('.group_flairs');
        var data = {};
        data.game_id = gameId;
        data.load_game_flair_list = 1;
        groupArea.empty();
        if(!gameId)
        {
            return null;
        }
        groupSelect.addClass('loading');
        $.post('',data,function(response){
            groupSelect.removeClass('loading');
            var gameFlairs = $(response.html);

            groupArea.empty();
            gameFlairs.appendTo(groupArea);

            $('.game_group').sortable(gameGroupSortableOptions);
            $('.folder_group').sortable(folderGroupSortableOptions);
        }).error(function(){
            groupSelect.removeClass('loading');
            alert('Server errro! On No!');
        });
    });

    $('.group-select').on('submit','.add_new_folders_form', function(e){
        e.preventDefault();
        var data = $(this).serializeArray();
        var form = $(this);
        $.post('',data, function(response){
            if(response.success)
            {
                form.closest('.group-select').find('.game_group_select').trigger('change');
            }
        });
    });

});



$('.flair_detail').on('click','.delete',function(){
    return confirm('Remove Flair?');
});


/** WEBPACK FOOTER **
 ** ./../components/FlairManager.jsx
 **/