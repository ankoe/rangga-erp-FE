<template>
  <div class="main-content">
    <breadcumb :page="'Message'" :folder="'Auth'" />

    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <b-row>
                <b-col sm="6" class="my-auto">
                  <h4>Recent</h4>
                </b-col>
                <b-col sm="6">
                  <form @submit.prevent="filterRoom">
                    <b-input-group>
                      <b-form-input :placeholder="getProfile.role_display_name == 'user' ? 'No PR' : 'No PR / no RFQ'"
                        v-model="search"></b-form-input>
                      <b-input-group-append>
                        <b-button type="submit" variant="info"><i class="i-Data-Search"></i></b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </form>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="inbox_chat" v-if="!loadingConversation">
            <div v-if="showConversations.length > 0">
              <div class="chat_list" :class="[conversation.id == conversationActive.id ? 'active_chat' : '']"
                v-for="(conversation, index) in showConversations" :key="index">
                <div class="chat_people">
                  <div class="chat_img">
                    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                    <div class="text-center mt-1">
                      {{ conversation.sender.type == getProfile.role_display_name ? conversation.receiver.type :
                        conversation.sender.type }}
                    </div>
                  </div>
                  <div class="chat_ib d-flex justify-content-between">
                    <div @click="openChat(conversation)">
                      <h5 class="mb-1">{{ conversation.sender.type == getProfile.role_display_name ?
                        conversation.receiver.name :
                        conversation.sender.name }} - {{
    conversation.receiver.type == 'vendor' ? conversation.purchaseRequest.code_rfq :
    conversation.purchaseRequest.code }}
                      </h5>
                      <p>{{ conversation.lastMessage }}</p>
                    </div>
                    <div>
                      <small class="chat_date">
                        {{ conversation.lastTime | luxon }}
                      </small>
                      <button class="btn btn-sm btn-danger ml-1 p-1"
                        @click="onDeleteConversation(conversation.id, index)">Hapus</button>

                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-center p-5">Belum ada percakapan</p>
            </div>

          </div>
          <div class="inbox_chat" v-else>
            <div style="right: 40%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
              Loading...
            </div>
          </div>
        </div>
        <div class="mesgs">
          <div v-if="conversationActive.receiverId">
            <div class="msg_history" id="divMsg">
              <template v-if="chats.length > 0">
                <div v-for="(chat, chatIndex) in chats" :key="chatIndex">
                  <div class="outgoing_msg mb-2" v-if="chat.user_id == conversationActive.senderId">
                    <div class="sent_msg">
                      <p v-if="chat.type == 'text' || chat.type == '' || chat.type == null">{{
                        chat.message
                      }}</p>
                      <p v-else-if="chat.type == 'image'"><img :src="chat.file"></p>
                      <p v-else-if="chat.type == 'docs'">
                        <a :href="chat.file" target="_blank" style="color:white;">
                          <i class="i-File" aria-hidden="true"></i>
                          {{ chat.message }}
                        </a>
                      </p>
                      <span class="time_date"> {{ chat.time | luxon }}</span>
                    </div>
                  </div>
                  <div class="incoming_msg mb-2" v-else>
                    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                        alt="sunil">
                    </div>
                    <div class="received_msg">
                      <div class="received_withd_msg">
                        <p v-if="chat.type == 'text' || chat.type == '' || chat.type == null">{{
                          chat.message
                        }}</p>
                        <p v-else-if="chat.type == 'image'"><img :src="chat.file"></p>
                        <p v-else-if="chat.type == 'docs'">
                          <a :href="chat.file" target="_blank" style="color:white;">
                            <i class="i-File" aria-hidden="true"></i>
                            {{ chat.message }}
                          </a>
                        </p>
                        <span class="time_date"> {{ chat.time | luxon }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else>
                <p>Belum ada percakapan</p>
              </div>
            </div>
            <div class="type_msg">
              <form @submit.prevent="sendMessage">
                <div class="input_msg_write">
                  <input v-model="formMessage" type="text" class="write_msg" placeholder="Type a message" />
                  <button class="msg_send_btn" type="submit"><i class="i-Paper-Plane" aria-hidden="true"></i></button>
                  <button class="msg_send_btn" type="button" @click="openModal" style="right: 44px;"><i class="i-File"
                      aria-hidden="true"></i></button>
                </div>
              </form>
            </div>
          </div>
          <div v-else class="msg_history">
            <h6 class="my-auto mx-auto">
              Pilih salah satu pesan
            </h6>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="modal" title="Upload File">
      <b-row class="mb-3">

        <b-col lg="12" class="mb-3">
          <b-form-group label="Attach File" label-for="unit_price">
            <b-form-file v-model="formFile" :state="Boolean(formFile)" placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."></b-form-file>
          </b-form-group>
        </b-col>

      </b-row>

      <template #modal-footer="{ ok }">
        <form @submit.prevent="sendMessage">

          <b-button variant="secondary" size="sm" @click="hideModal">Close Me</b-button>
          <b-button class="ml-2" type="submit" size="sm" variant="primary" @click="ok">
            Kirim
          </b-button>
        </form>
      </template>
    </b-modal>

  </div>
</template>


<script>
import { mapGetters } from "vuex"

export default {
  metaInfo: {
    title: "Purchase Request",
  },
  data() {
    return {
      conversationActive: {
        id: null,
        senderId: null,
        receiverId: null,
        purchaseRequestId: null,
        requestQuotationId: null,
      },
      conversations: [],
      showConversations: [],
      chats: [],
      formFile: null,
      formMessage: null,
      search: null,
      loadingConversation: false,
      loadingChat: false,
    }
  },
  mounted() {
    this.getConversation()
  },
  computed: {
    ...mapGetters(["getRate", "getExchangeLocale", 'getProfile'])
  },
  methods: {
    async initChat() {
      this.conversationActive.senderId = this.getProfile.id

      if (localStorage.getItem('conversation')) {
        const dataStorage = JSON.parse(localStorage.getItem('conversation'))
        localStorage.removeItem('conversation')

        const conversation = this.conversations.find(conversation => {
          return conversation.type == dataStorage.type
        })

        if (conversation) {
          this.conversationActive.id = conversation
          this.conversationActive.receiverId = conversation
          this.conversationActive.purchaseRequestId = conversation
          this.conversationActive.requestQuotationId = conversation

        } else {
          this.conversationActive.receiverId = dataStorage.receiver.id
          this.conversationActive.purchaseRequestId = dataStorage.purchaseRequest.id
          this.conversationActive.requestQuotationId = dataStorage.requestQuotation.id

          await this.axios.post('message/conversation', {
            sender_user_id: this.getProfile.id,
            receiver_user_id: dataStorage.receiver.id,
            sender_type: this.getProfile.role_display_name,
            receiver_type: dataStorage.type,
            purchase_request_id: dataStorage.purchaseRequest.id,
            request_quotation_id: dataStorage.requestQuotation.id
          })

          this.getConversation()
        }
      }


    },
    async getConversation() {
      this.loadingConversation = true

      let { data } = await this.axios.get('message/conversation/all', {
        params: {
          sender_user_id: this.getProfile.id,
          sender_type: this.getProfile.role_display_name
        }
      })

      this.conversations = data.data.map(item => {
        return {
          id: item.id,
          requestQuotation: {
            id: item.request_quotation.id
          },
          purchaseRequest: {
            id: item.purchase_request.id,
            code: item.purchase_request.code,
            code_rfq: item.purchase_request.code_rfq
          },
          receiver: {
            id: item.receiver.id,
            name: item.receiver.name,
            type: item.receiver_type
          },
          sender: {
            id: item.sender.id,
            name: item.sender.name,
            type: item.sender_type
          },
          lastTime: item.chats[0] ? item.chats[0].created_at : null,
          lastMessage: item.chats[0] ? item.chats[0].message : null,
        }
      })

      this.showConversations = this.conversations

      this.loadingConversation = false

      this.initChat()
    },
    async getChat() {
      this.loadingChat = true

      let { data } = await this.axios.get('message/chat/all', {
        params: {
          conversation_id: this.conversationActive.id
        }
      })

      this.chats = data.data.map(item => {
        return {
          id: item.id,
          conversation_id: item.conversation_id,
          user_id: item.user_id,
          type: item.type,
          message: item.message,
          time: item.created_at,
          file: item.file
        }
      }).sort((a, b) => a.id - b.id)

      this.loadingChat = false
    },
    async filterRoom() {
      this.loadingRoom = true

      this.showConversations = this.conversations.filter(conversation => {
        const search = this.search.toLowerCase()
        const pr = conversation.purchaseRequest.code.toLowerCase()
        const rfq = conversation.purchaseRequest.code_rfq.toLowerCase()

        return pr.includes(search) || rfq.includes(search)
      })
      console.log(this.showConversations, 'show')
      this.loadingRoom = false
    },
    async onDeleteConversation(id, index) {
      if (confirm("Seluruh riwayat percakapan akan hilang, Apakah anda yakin?")) {
        // reset chat
        this.conversationActive.receiverId = null
        this.conversations.splice(index, 1)
        if (id) {
          await this.axios.delete('message/conversation/' + id)
          this.getConversation()
        }

      }
    },
    openChat(conversation) {
      this.conversationActive.id = conversation.id
      this.conversationActive.receiverId = conversation.receiver.id
      this.purchaseRequestId = conversation.purchaseRequest.id
      this.requestQuotationId = conversation.requestQuotation.id
      this.getChat()
    },
    async sendMessage() {

      if (this.formMessage || this.formFile) {
        console.log(this.conversationActive, 'conve')
        const formData = new FormData()
        formData.append('conversation_id', this.conversationActive.id)
        formData.append('user_id', this.getProfile.id)
        formData.append('message', this.formMessage)
        formData.append('file', this.formFile)

        let { data } = await this.axios.post('message/chat', formData)

        if (data.data) {
          this.chats.push({
            id: data.data.id,
            user_id: data.data.user_id,
            type: data.data.type,
            content: data.data.message,
            time: data.data.created_at,
            filename: ''
          })

          this.formMessage = null
        }

        this.getChat()
      }
    },
    openModal() {
      this.formFile = null
      this.$refs['modal'].show()
    },
    hideModal() {
      this.formFile = null
      this.$refs['modal'].hide()
    },
  }
}
</script>


<style scoped>
.container {
  max-width: 1170px;
  margin: auto;
}

img {
  max-width: 100%;
}

@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }

  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}

.spin::before {
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  border: solid 5px #cfd0d1;
  border-bottom-color: #1c87c9;
  border-radius: 50%;
  content: "";
  height: 40px;
  width: 40px;
  position: absolute;
  top: 10%;
  left: 10%;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
}

.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}

.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}

.top_spac {
  margin: 20px 0 0;
}


/* .recent_heading {
    float: left;
    width: 40%;
} */

.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}

.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}

.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}

.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}

.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}

.chat_ib h5 span {
  font-size: 13px;
  float: right;
}

.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto
}

.chat_img {
  float: left;
  width: 11%;
}

.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}



.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}

.inbox_chat {
  height: 550px;
  overflow-y: scroll;
  position: relative;
}

.active_chat {
  background: #ebebeb;
}

.chat_people:hover {
  cursor: pointer;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}

.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}

.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}

.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 1px 0 0;
}

.received_withd_msg {
  width: 57%;
}

.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}

.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}

.sent_msg {
  float: right;
  width: 46%;
}

.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}

.messaging {
  padding: 0 0 50px 0;
}

.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>