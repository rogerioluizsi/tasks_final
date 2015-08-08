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
				
				// Função/Listener para o botão que abre o formulário de cadastro de tarefas
				$(taskPage).find( '#btnAddTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage ).find('#taskCreation').removeClass('not');
				});
				
				// Função - listener para botão de limpar o formulário de cadastro de tarefas
				$(taskPage).find( '#clearTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskForm').trigger('reset');
				});

				// Função/Listener para destacar a linha clicada
				$(taskPage).find('tbody').click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ':not(nav)' ).toggleClass( 'rowHighlight');
				});

				// Função/Listener para apagar uma tarefa
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete(type, $(evt.target).data().taskId, 
							function() {
								$(evt.target).parents('tr').remove(); 
							}, errorLogger);
						tasksController.countTasks();
					}
				);

				// 4. Marcar tarefas como completadas (usando strikethrough no texto)
				// Esta função marca uma tarefa como concluida
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', 
					function(evt) { 
						// Utiliza o método findById para recuperar a tarefa a partir do seu id.
						storageEngine.findById(type, $(evt.target).data().taskId, function(task) {
							// Chama o método complete do storageEngine para persistir no banco de dados a informação de que esta tarefa foi concluida
							storageEngine.complete(type, task, function(){
								// A partir do elemento clicado (Completar) localizo os elementos acima dele para aplicar a classe "taskCompleted" 
								$(evt.target).parents().eq(1).siblings().addClass('taskCompleted');
								// Aplico fadeOut() para ocultar, com efeito, o link/botão "Completar"
								$(evt.target).fadeOut(1000);
								// Localiza e aplica, também com efeito, o link/botão "Editar"
								$(evt.target).parent().find(".editRow").fadeOut(1000);
								// Chama o método countTasks() para atualizar os totais impressos no rodapé da página
								tasksController.countTasks();
							}, errorLogger);
						}, errorLogger);
					});		

				// Função/Listener para salvar (persistir) uma tarefa
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

				// Função/Listener para editar uma tarefa listada. Consulta os dados desta tarefa a partir
				// do seu id e alimenta o formulário de cadastro de tarefas com os dados desta tarefa		
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
		// Esta função foi alterada para atender as tarefas 01 e 03
		loadTasks : function() {
			// 5. Exibir as tarefas ordenadas na aplicação
			// Alterei para chamar o método findOrdered afim de recuperar as tarefas ordenadas pelo atributo findOrdered
			storageEngine.findAll(type, 
				function(tasks) {
					$.each(tasks, function(index, task) {
						$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
						// Testa se requiredBy é menor do que a data atual, caso verdadeiro atribui a classe CSS "overdue" 
						if ((Date.today().compareTo(Date.parse(task.requiredBy))) == 1){
						 	$('tr[row-task-id="'+task.id+'"]').addClass('overdue');
						// Caso falso, testa novamente se a tarefa irá vencer nos próximos 3 dias, caso verdade atribui a classe CSS "warning"
						} else if (Date.parse(task.requiredBy).between(Date.today(), Date.today().add({ days: 3 }))){
							$('tr[row-task-id="'+task.id+'"]').addClass('warning');
						}
						// Testa se a tarefa já foi marcada como concluida
						if (task.complete == 'Ok'){
							// Caso verade, atribui a classe CSS "taskCompleted a linha (tr), oculta os links de Editar e Completar"
							$('tr[row-task-id="'+task.id+'"]').addClass('taskCompleted');
							$('a[data-task-id="'+task.id+'"]').first().next().hide();
							$('a[data-task-id="'+task.id+'"]').first().hide();
						}
					});
					// Chama o método countTasks() para atualizar o rodapé com as quantidades de tarefas concluidas e não concluidas
					tasksController.countTasks();
				}, 
				errorLogger);
		},
		// esta função é para atender a tarefa 01 e uma parte da tarefa 04:
		// 1. Atualizar a contagem no rodapé ao carregar e quando modificar quantidade de tarefas
		// 4. Marcar tarefas como completadas (usando strikethrough no texto)
		// - Exibir no rodapé apenas contagem de tarefas não completadas
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
		// 4. Marcar tarefas como completadas (usando strikethrough no texto)
		// Esta Função é para persistir a informação de que uma tarefa foi marcada como concluida
		complete : function(type, obj, successCallback, errorCallback){
			// Registra uma string "Ok" no campo completed para indicar que a tarefa foi concluida
			$.ajax({method: "POST", url: window.urlPath + "task/complete/"+obj.id}).done(function(msg){successCallback(obj)});	
		},
		findAll : function(type, successCallback, errorCallback) {
			// Declara e inicializa um novo Array
			var aTasks = [];
			// Recuperar todos os objetos do tipo "task"
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

