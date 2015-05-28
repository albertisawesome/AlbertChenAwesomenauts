
/* Game namespace */
var game = {
    // an object where to store game information
    data: {
        // score
        score: 0,
        option1: "",
        option2: "",
        enemyBaseHealth: 10,
        playerBaseHealth: 10,
        enemyCreepHealth: 10,
        enemyCreepAttack: 1,
        enemyCreepAttackTimer: 1000,
        PlayerCreepHealth: 10,
        PlayerCreepAttack: 1,
        PlayerCreepAttackTimer: 1000,
        creepMoveSpeed: 5,
        playerHealth: 10,
        playerAttack: 1,
        playerAttackTimer: 850,
        playerMoveSpeed: 5,
        heroHealth: 50,
        heroAttack: 5,
        heroAttackTimer: 2000,
        heroMoveSpeed: 10,
        heroAbility1timer: 1000,
        heroAbility2timer: 1000,
        heroAbility3timer: 1000,
        heroAbility1: 1,
        heroAbility2: 1,
        heroAbility3: 1,
        gameTimerManager: "",
        heroDeathManager: "",
        spearTimer: 1000,
        arrowTimer: 100,
        fireballTimer: 10000,
        magicTimer: 100,
        player: "",
        player2: "",
        player3: "",
        player4: "",
        player5: "",
        enemyhero: "",
        enemyhero2: "",
        exp: 0,
        gold: 10,
        skill1: 0,
        skill2: 0,
        skill3: 0,
        ability1: 0,
        ability2: 0,
        ability3: 0,
        win: "",
        pausePos: "",
        buyscreen: "",
        pausescreen: "",
        buytext: "",
        minimap: "",
        miniPlayer: "",
        audio: ""
   },
    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init("screen", me.video.CANVAS, 1067, 600, true, '1.0')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        //my now screnns that not in used.
        me.state.SPENDEXP = 112;
        me.state.LOAD = 113;
        me.state.NEW = 114;
        me.state.CHARACTER = 115;

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loaded.
    "loaded": function() {
        me.pool.register("player", game.PlayerEntity, true);
        me.pool.register("player2", game.Player2Entity, true);
        me.pool.register("player3", game.Player3Entity, true);
        me.pool.register("player4", game.Player4Entity, true);
        me.pool.register("player5", game.Player5Entity, true);
        me.pool.register("enemyhero", game.enemyhero, true);
        me.pool.register("enemyhero2", game.enemyhero2, true);
        me.pool.register("PlayerBase", game.PlayerBaseEntity);
        me.pool.register("EnemyBase", game.EnemyBaseEntity);
        me.pool.register("EnemyCreep", game.EnemyCreep, true);
        me.pool.register("PlayerCreep", game.PlayerCreep, true);
        me.pool.register("GameTimerManager", game.GameTimerManager);
        me.pool.register("HeroDeathManager", game.HeroDeathManager);
        me.pool.register("ExperienceManager", game.ExperienceManager);
        me.pool.register("SpendGold", game.SpendGold);
        me.pool.register("Pause", game.Pause);
        me.pool.register("spear", game.SpearThrow, true);
        me.pool.register("arrow", game.arrow, true);
        me.pool.register("fireball", game.fireball, true);
        me.pool.register("magic", game.magic, true);
        me.pool.register("minimap", game.minimap, true);
        me.pool.register("miniplayer", game.MiniPlayerLocation, true);

        //the screen states that will be in the game 
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.SPENDEXP, new game.SpendExp());
        me.state.set(me.state.LOAD, new game.LoadProfile());
        me.state.set(me.state.NEW, new game.NewProfile());
        me.state.set(me.state.CHARACTER, new game.NewProfile());

        // Start the game.
        me.state.change(me.state.MENU);
    }
};