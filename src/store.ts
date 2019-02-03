import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const initialState = {
	nowPlaying: {
		id: -1,
		name: "",
		artist: "",
		points: 0,
		data: { source: -1, url: "", thumbnailUrl: "", duration: 0, currentTime: 0, suggested: false },
	},
	currentTime: 0,
	playing: { status: false, fromServer: false },
	connection: {
		admin: false,
		roomId: -1,
		songList: [],
		type: -1,
	},
};


export default new Vuex.Store({
	state: {
		nowPlaying: {
			id: -1,
			name: "",
			artist: "",
			points: 0,
			data: { source: -1, url: "", thumbnailUrl: "", duration: 0, currentTime: 0, suggested: false },
		},
		currentTime: 0,
		playing: { status: false, fromServer: false },
		connection: {
			admin: false,
			roomId: -1,
			songList: [],
			type: -1,
		},
	},
	getters: {
		nowPlaying(state) {
			return state.nowPlaying;
		},
		currentTime(state) {
			return state.currentTime;
		},
		playing(state) {
			return state.playing;
		},
		connection(state) {
			return state.connection;
		},
	},
	mutations: {
		nowPlaying(state, data) {
			state.nowPlaying = data;
		},
		currentTime(state, data) {
			state.currentTime = data;
		},
		playing(state, data) {
			state.playing = data;
		},
		connection(state, data) {
			state.connection = data;
		},
		reset_state(state) {
			state = initialState;
		},
	},
});
