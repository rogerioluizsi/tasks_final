package tasks

class Category {
	String name

	static hasMany = [tasks:Task]

	String toString(){
		this.name
	}

	def toArray(){
		[id: this.id, nome: this.name]
	}
	
    static constraints = {
    }
}
