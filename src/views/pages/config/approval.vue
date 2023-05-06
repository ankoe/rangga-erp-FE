<style  scoped>
.app-footer {
    margin-top: 2rem;
    background: #eee;
    padding: 1.25rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: none;
}
</style>
<template>
  <div class="main-content">
    <breadcumb :page="'Approval'" :folder="'Config'" />

    <b-row>
      <!-- column-one -->
      <b-col md="6" class="mb-30">
        <b-card>
          <div class="d-flex justify-content-between mb-3">
            <p class="card-title m-0">Office</p>

            <div class="btn-group">
              <b-button variant="primary">Add Role</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <transition-group
                  type="transition"
                  :name="!drag ? 'flip-list' : null"
                >
                  <b-card
                    class="mb-30 cursor-pointer"
                    v-for="element in list1"
                    :key="element.name"
                  >
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ element.name }}</h6>
                      <a href>
                        <i class="nav-icon i-Pen-2"></i>
                      </a>
                    </div>
                    <div
                      class="ul-board--description d-flex justify-content-between mt-3"
                    >
                      <div class="ul-board--lDesc d-flex align-items-center">
                        <i class="nav-icon i-Speach-Bubble-3 mr-1"></i>
                        <span class="text-muted">7</span>
                      </div>
                    </div>
                  </b-card>
                </transition-group>
              </draggable>
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <!-- column-two -->
      <b-col md="6" class="mb-30">
        <b-card>
          <div class="d-flex justify-content-between mb-3">
            <p class="card-title m-0">Procurement</p>

            <div class="btn-group">
              <b-button variant="primary">Add Role</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <transition-group
                  type="transition"
                  :name="!drag ? 'flip-list' : null"
                >
                  <b-card
                    class="mb-30 cursor-pointer"
                    v-for="element in list2"
                    :key="element.name"
                  >
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ element.name }}</h6>
                      <a href>
                        <i class="nav-icon i-Pen-2"></i>
                      </a>
                    </div>
                    <div
                      class="ul-board--description d-flex justify-content-between mt-3"
                    >
                      <div class="ul-board--lDesc d-flex align-items-center">
                        <i class="nav-icon i-Speach-Bubble-3 mr-1"></i>
                        <span class="text-muted">7</span>
                      </div>
                    </div>
                  </b-card>
                </transition-group>
              </draggable>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Paging Table"
  },
  display: "Transitions",
  order: 7,
  components: {
    draggable
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ],
      list3: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 }
      ],

      drag: false
    };
  },
  methods: {},
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
</script>
