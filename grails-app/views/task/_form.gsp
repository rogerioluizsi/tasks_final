<%@ page import="tasks.Task" %>



<div class="fieldcontain ${hasErrors(bean: taskInstance, field: 'categoria', 'error')} required">
	<label for="categoria">
		<g:message code="task.categoria.label" default="Categoria" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="categoria" name="categoria.id" from="${tasks.Categoria.list()}" optionKey="id" required="" value="${taskInstance?.categoria?.id}" class="many-to-one"/>

</div>

<div class="fieldcontain ${hasErrors(bean: taskInstance, field: 'complete', 'error')} required">
	<label for="complete">
		<g:message code="task.complete.label" default="Complete" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="complete" required="" value="${taskInstance?.complete}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: taskInstance, field: 'requiredBy', 'error')} required">
	<label for="requiredBy">
		<g:message code="task.requiredBy.label" default="Required By" />
		<span class="required-indicator">*</span>
	</label>
	<g:datePicker name="requiredBy" precision="day"  value="${taskInstance?.requiredBy}"  />

</div>

<div class="fieldcontain ${hasErrors(bean: taskInstance, field: 'task', 'error')} required">
	<label for="task">
		<g:message code="task.task.label" default="Task" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="task" required="" value="${taskInstance?.task}"/>

</div>

