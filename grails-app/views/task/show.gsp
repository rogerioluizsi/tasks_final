
<%@ page import="tasks.Task" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'task.label', default: 'Task')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-task" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-task" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list task">
			
				<g:if test="${taskInstance?.categoria}">
				<li class="fieldcontain">
					<span id="categoria-label" class="property-label"><g:message code="task.categoria.label" default="Categoria" /></span>
					
						<span class="property-value" aria-labelledby="categoria-label"><g:link controller="category" action="show" id="${taskInstance?.categoria?.id}">${taskInstance?.categoria?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${taskInstance?.complete}">
				<li class="fieldcontain">
					<span id="complete-label" class="property-label"><g:message code="task.complete.label" default="Complete" /></span>
					
						<span class="property-value" aria-labelledby="complete-label"><g:fieldValue bean="${taskInstance}" field="complete"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${taskInstance?.requiredBy}">
				<li class="fieldcontain">
					<span id="requiredBy-label" class="property-label"><g:message code="task.requiredBy.label" default="Required By" /></span>
					
						<span class="property-value" aria-labelledby="requiredBy-label"><g:formatDate date="${taskInstance?.requiredBy}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${taskInstance?.task}">
				<li class="fieldcontain">
					<span id="task-label" class="property-label"><g:message code="task.task.label" default="Task" /></span>
					
						<span class="property-value" aria-labelledby="task-label"><g:fieldValue bean="${taskInstance}" field="task"/></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:taskInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${taskInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
