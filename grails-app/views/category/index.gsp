<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'categoria.label', default: 'Categoria')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<nav>
			<g:link controller="task" action="index"> Voltar</g:link>						
		</nav>
		<div id="list-categoria" class="content scaffold-list" role="main">
			%{-- <h1><g:message code="Categorias" args="[entityName]" /></h1> --}%
				<g:if test="${flash.message}">
					<div class="message" role="status">${flash.message}</div>
				</g:if>
				<table>
				<thead>
					<tr>
					
						<g:sortableColumn property="nome" title="${message(code: 'categoria.nome.label', default: 'Categorias')}" />
						<th></th>
					</tr>
				</thead>
				<tbody>

				<g:each in="${categoriaInstanceList}" status="i" var="categoriaInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
											
						<td><g:link action="show" id="${categoriaInstance.id}">${fieldValue(bean: categoriaInstance, field: "nome")}</g:link></td>
						<td>
							<g:form url="[resource:categoriaInstance, action:'delete']" method="DELETE">
								<fieldset class="buttons">
									<nav>
										<g:link class="edit" action="edit" resource="${categoriaInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
										<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
									</nav>
								</fieldset>
							</g:form>
						</td>
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${categoriaInstanceCount ?: 0}" />
			</div>
				<nav>
					 <g:link class="create" action="create"><g:message code="Nova" args="[entityName]" /></g:link> 
				</nav>

		</div>
	</body>
</html>

