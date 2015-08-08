<%@ page import="tasks.Categoria" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<asset:stylesheet src="02-tasks.css"/> 
		<g:set var="entityName" value="${message(code: 'categoria.label', default: 'Categoria')}" />
		<title><g:message code="default.create.label" args="[entityName]" /></title>
	</head>
	<body>
	
		<div class="nav" role="navigation">
			
				
				<nav>
					<li><g:link class="list" action="index"><g:message code="Voltar" args="[entityName]" /></g:link></li>
				</nav>
			
		</div>
		<div id="edit-categoria" class="content scaffold-edit" role="main">
			<h1><g:message code="Editar categoria" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<g:hasErrors bean="${categoriaInstance}">
			<ul class="errors" role="alert">
				<g:eachError bean="${categoriaInstance}" var="error">
				<li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
				</g:eachError>
			</ul>
			</g:hasErrors>
			<g:form url="[resource:categoriaInstance, action:'update']" method="PUT" >
				<g:hiddenField name="version" value="${categoriaInstance?.version}" />
				<fieldset class="form">
					<g:render template="form"/>
				</fieldset>
				<fieldset class="buttons">
					<g:actionSubmit class="save" action="update" value="Salvar" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
