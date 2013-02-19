function Game(board,players){
	new Observable(this);
	this.board = board;
	var players = players;
	var current_player_index = 0;
	this.play = function(r,c){
		if(!this.canPlay(r,c)) return false;
		this.board.setCell(r, c, players[current_player_index].symbol);
		current_player_index++; //when a play occurs, the next player is immediately given a turn
		if(current_player_index >= players.length) current_player_index = 0;
	};
	var won = false;
	this.canPlay = function(r,c){
		return !won && this.board.getCell(r,c) == null; //there must not already be a winner and the requested cell must be empty
	};
	var self = this;
	this.board.on('tic_tac_toe',function(){ //a tic_tac_toe on the board results in a game win for the current player
		won = true;
		self.notifyObservers('win', players[current_player_index]);
	});
}
