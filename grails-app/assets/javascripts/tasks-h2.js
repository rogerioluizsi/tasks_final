// storageEngine define as principais funções para persistências utilizando a base de dados H2

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

