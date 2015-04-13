game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        //sets type to PlayerEntity
        this.type = "PlayerEntity";
        this.setFlags();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
                //loads the image for the sprite
                image: "player",
                width:64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function(){
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
        }]);
    },
    
    setPlayerTimers: function(){
        //sets the player timer for attacks
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastAttack = new Date().getTime();
    },
    
    setAttributes: function(){
        //sets the health and attack that was loaded in game.js
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
        //starting direction
        this.facing = "right";
        this.dead = false;
    },
    
    addAnimation: function(){
        //sets and add animations for the player
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
        this.renderable.addAnimation("attack", [91, 91, 93, 94, 95, 96, 97, 98], 80);
    },
    
    update: function(delta){
        //checks and update functions that supports the player
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation();
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function(){
        //checks if the player is dead
        if(this.health <= 0){
            return true;
        }
        return false;
    },
    
    checkKeyPressesAndMove: function(){
        //checks if the player inputs a KeyPress function and triggers when so.
        if(me.input.isKeyPressed("right")){
            //sets the charater to move right
            this.moveRight();
        }else if(me.input.isKeyPressed("left")){
            //sets the character to jump
            this.moveLeft();
        }else{
            //set the speed to any direction to 0
            this.body.vel.x = 0;
        }
        
        if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
            //checks if the body isnt jumping nor falling so the charater cant double jump or fly
            this.jump();
        }
        //sets this key to attack 
        this.attacking = me.input.isKeyPressed("attack");
    },
    
    moveRight: function(){
        //sets it so when the right key is pressed, the character faces right and walk
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.facing = "right";
        this.flipX(false);
    },
    
    moveLeft: function(){
        //just like the one for moving right, this does it for the left instead.
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.facing = "left";
        this.flipX(true);
    },
    
    jump: function(){
        //sets the charater to be able to jump
        this.body.jumping = true;
        this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    
    checkAbilityKeys: function(){
        //checks if any skill is pressed
        if(me.input.isKeyPressed("skill1")){
            //this.speedBurst();
        }else if(me.input.isKeyPressed("skill2")){
            //this.eatCreep();
        }else if(me.input.isKeyPressed("skill3")){
            this.throwSpear();
        }
    },
    
    throwSpear: function(){
        //checks the timer to throw the spear
        if(this.now-this.lastSpear >= game.data.spearTimer && game.data.ability3 >= 0){
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    
    setAnimation: function(){
        //sets the animation based on the keys pressed
        if(this.attacking){
            if(!this.renderable.isCurrentAnimation("attack")){
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }else if(this.body.vel.x !==0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
            }
        }else if(!this.renderable.isCurrentAnimation("attack")){
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
    loseHealth: function(damage){
        //sets so the plpayer could lose health
        this.health = this.health - damage;
    },
    
    collideHandler: function(response){
        //checks if the player collide with any of the following entities
        if(response.b.type==='EnemyBaseEntity'){
            this.collideWithEnemyBase(response);
        }else if(response.b.type==='EnemyCreep'){
            this.collideWithEnemyCreep(response);
        }
    },
    
    collideWithEnemyBase: function(response){
        //checks the cordinate so if wont look ugly when it attacks
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;
        //checks to make sure they are facing the right way
        if(ydif<-40 && xdif<70 && xdif>-39){
            this.body.falling = false;
            this.body.vel.y = -1;
        }else if(xdif>-35 && this.facing==='right' && xdif<0){
            this.body.vel.x = 0;
        }else if(xdif<70 && this.facing==='left' && xdif>0){
            this.body.vel.x = 0;
        }
        //set the animation to attack wheen the attack key is pressed
        if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
            this.lastHit = this.now;
            response.b.loseHealth(game.data.playerAttack);
        }
    },
    
    collideWithEnemyCreep: function(response){
        //checks for the collision with the enemy creep the same way with the base.
        var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            this.stopMovement(xdif);
            if(this.checkAttack(xdif, ydif)){
                this.hitCreep(response);
            };
    },
    
    stopMovement: function(xdif){
        //set the player to stop moving
        if(xdif>0){
                if(this.facing==="left"){
                    this.body.vel.x = 0;
                }
            }else{
                if(this.facing==="right"){
                    this.body.vel.x = 0;
                }
            }
    },
    
    checkAttack: function(xdif, ydif){
        //sets the animation for attack and the damage for the attack.
        if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif) <40)  && 
                    (((xdif>0 ) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
                    ){
                this.lastHit = this.now;
                return true;
            }
        return false;
    },
    
    hitCreep: function(response){
        //checks for the responce from the enemy creep
        if(response.b.health <= game.data.playerAttack){
            game.data.gold += 100;
        }
        response.b.loseHealth(game.data.playerAttack);
    }
});