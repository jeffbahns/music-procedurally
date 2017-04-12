var RoleGroup = function(scale, context) {
    this.scale = scale;
    this.context = context;
    this.roles = []
}

RoleGroup.prototype.play(position) {
    roles.forEach(function(r) {
	r.play();
    });
}

RoleGroup.prototype.display() {
    roles.forEach(function(r) {
	r.display();
    });
}
