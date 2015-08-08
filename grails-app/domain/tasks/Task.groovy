package tasks

class Task {
	String complete
	String task
	Date requiredBy
	Category categoria

    static constraints = {
    	
    }

    def String toString(){
    	[id: this.id, task: this.task, complete: this.complete, requiredBy: this.requiredBy, categoria_nome: this.categoria.name, categoria: this.categoria.id]
    }

    def toArray() {
        return [id: this.id, task: this.task, requiredBy: this.requiredBy.format('yyyy-MM-dd'), complete: this.complete, categoria_nome: this.categoria.name, categoria: this.categoria.id]
    }

}