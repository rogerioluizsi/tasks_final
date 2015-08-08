if ($(location).attr('hostname') == "localhost"){
	window.urlPath = "http://" + $(location).attr('host') + "/tasks/";
} else {
	window.urlPath = "http://" + $(location).attr('host') + "/";
}

(function($) {
  $.fn.extend({
    toObject: function() {
      var result = {}
      $.each(this.serializeArray(), function(i, v) {
        result[v.name] = v.value;
      });
      return result;
      },
    fromObject: function(obj) {
      $.each(this.find(':input'), function(i,v) {
        var name = $(v).attr('name');
        if (obj[name]) {
          $(v).val(obj[name]);
        } else {
          $(v).val('');
        }
      });
    }
  });
})(jQuery);



tasksController = function() {
	function errorLogger(errorCode, ErrorMessage){
		console.log(errorCode+':'+errorMessage);
	}
	var taskPage;
	var initialised = false;
	var type = "task";
	return {
		init : function(page) {
			if (!initialised) {
				storageEngine.init( function() { tasksController.loadTasks(); }, errorLogger );
				taskPage = page;
				$(taskPage).find('[required="required"]').prev('label').append('<span>*</span>').children( 'span').addClass('required');
				$(taskPage).find('tbody tr:even').addClass('even');
						
				$(taskPage).find( '#btnAddTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage ).find('#taskCreation').removeClass('not');
				});
				
				
				$(taskPage).find( '#clearTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskForm').trigger('reset');
				});

			
				$(taskPage).find('tbody').click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ':not(nav)' ).toggleClass( 'rowHighlight');
				});

			
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete(type, $(evt.target).data().taskId, 
							function() {
								$(evt.target).parents('tr').remove(); 
							}, errorLogger);
						tasksController.countTasks();
					}
				);

			
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', 
					function(evt) { 
					
						storageEngine.findById(type, $(evt.target).data().taskId, function(task) {
							storageEngine.complete(type, task, function(){
								$(evt.target).parents().eq(1).siblings().addClass('taskCompleted');
								$(evt.target).fadeOut(1000);
								$(evt.target).parent().find(".editRow").fadeOut(1000);
								tasksController.countTasks();
							}, errorLogger);
						}, errorLogger);
					});		

				$(taskPage).find('#saveTask').click(function(evt) {
					evt.preventDefault();
					if ($(taskPage).find('form').valid()) {
						var task = $(taskPage).find('form').toObject();
						storageEngine.save(type, task, function() {
							$(taskPage).find('#tblTasks tbody').empty();
							tasksController.loadTasks();
							$(':input:not(select)').val('');
							$(taskPage).find('#taskCreation').addClass('not');
						}, errorLogger);
					}
				});

				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
					function(evt) { 
						$(taskPage).find('#taskCreation').removeClass('not');
						storageEngine.findById(type, $(evt.target).data().taskId, function(task) {
							$(taskPage).find('form').fromObject(task);
						}, errorLogger);
					}
				);				
				initialised = true;
			}
    	},
		loadTasks : function() {
			storageEngine.findAll(type, 
				function(tasks) {
					$.each(tasks, function(index, task) {
						$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
						if ((Date.today().compareTo(Date.parse(task.requiredBy))) == 1){
						 	$('tr[row-task-id="'+task.id+'"]').addClass('overdue');
						} else if (Date.parse(task.requiredBy).between(Date.today(), Date.today().add({ days: 3 }))){
							$('tr[row-task-id="'+task.id+'"]').addClass('warning');
						}
						if (task.complete == 'Ok'){
							// Caso verade, atribui a classe CSS "taskCompleted a linha (tr), oculta os links de Editar e Completar"
							$('tr[row-task-id="'+task.id+'"]').addClass('taskCompleted');
							$('a[data-task-id="'+task.id+'"]').first().next().hide();
							$('a[data-task-id="'+task.id+'"]').first().hide();
						}
					});
					tasksController.countTasks();
				}, 
				errorLogger);
		},
		
		countTasks : function() {
			storageEngine.countTasks(function(data){
				$('#taskCount').text(data.count);
			}, errorLogger);

		}	

	}
}();

storageEngine = function() {
	var initialized = false;
	return {
		init : function(successCallback, errorCallback) {
			initialized = true;
			successCallback(null);
		},
		save : function(type, obj, successCallback, errorCallback) {
			console.log(obj);
			$.ajax({
				method: "post", 
				url: window.urlPath + "task/save", 
				data: obj
			})
			.done(function( msg ){
				successCallback(obj);
			});
		},
		
		complete : function(type, obj, successCallback, errorCallback){
			$.ajax({method: "POST", url: window.urlPath + "task/complete/"+obj.id}).done(function(msg){successCallback(obj)});	
		},
		findAll : function(type, successCallback, errorCallback) {
			var aTasks = [];
			$.ajax({method: 'GET', dataType: "JSON", url: window.urlPath + "task/list", 
					success: function (data) {
						var tasks = [];
						$.each(data, function(k, v){
							tasks.push(v);
						});
						successCallback(tasks);
					}
				});
		},
		delete : function(type, id, successCallback, errorCallback) {
			$.ajax({method: 'DELETE', dataType: 'JSON', url: window.urlPath + 'task/delete/'+id});
			successCallback(id);
		},
		findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
			$.ajax({
				method: 'GET', 
				dataType: 'JSON', 
				url: 'task/countTasks/'+propertyName+'/'+propertyValue, 
				success: function(data){
				var tasks = [];
				$.each(data, function(k, v){
					tasks.push(v);
				});
				successCallback(tasks);
			}})
		},
		countTasks : function (successCallback, errorCallback){
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'task/countTasks', success: function(data){
				successCallback(data);
			}});
		},
		findById : function (type, id, successCallback, errorCallback) {
			$.ajax({method: 'GET', dataType: 'JSON', url: window.urlPath + 'task/getById/'+id, success: function(task){
				console.log(task);
				successCallback(task);
			}});
		}
	}
}();

