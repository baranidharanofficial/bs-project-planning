import { Task, TaskDetails } from "@/components/custom/task-table";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface TaskState {
  tasks: Task[];
  categories: string[];
  currentTask: Task | null,
  currentTaskDetails: TaskDetails | null,
}

const initialState: TaskState = {
  tasks: [],
  categories: [],
  currentTask: null,
  currentTaskDetails: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state) => {
      let newtask: Task = {
        task_id: "",
        title: "test",
        category: "Test",
        status: "In Progress",
        expected_end_date: null,
        estimated_work: 100,
        unit: "",
        progress: 10,
      };
      state.tasks.push(newtask);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    setTask: (state, action : PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, () => {
      console.log("Tasks Loading");
    }).addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    }),

    builder.addCase(getCategories.pending, () => {
      console.log("Categories Loading");
    }).addCase(getCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    })

    builder.addCase(setTaskDetails.pending, () => {
      console.log("Task Details Loading");
    }).addCase(setTaskDetails.fulfilled, (state, action: PayloadAction<TaskDetails>) => {
      state.currentTaskDetails = action.payload;
    })
  }
});

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (projectId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.get_tasks_list?project_id=${projectId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Tasks:", response.data);
      return response.data.tasks;
    } catch (error) {
      console.error("Get Tasks failed:", error);
      return [];
    }
  }
);


export const getCategories = createAsyncThunk(
  "task/getCategories",
  async () => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.get_category_list`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Categories:", response.data);
      return response.data.category_options;
    } catch (error) {
      console.error("Get Categories failed:", error);
      return [];
    }
  }
);

export const setTaskDetails = createAsyncThunk(
  "task/setTask",
  async (taskId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.task_detail_view?task_id=${taskId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Task Detail:", response.data);
      return response.data.task_details;
    } catch (error) {
      console.error("Get Task Detail failed:", error);
      return [];
    }
  }
);

export const { addTask, clearTasks, setTask } = taskSlice.actions;

export default taskSlice.reducer;
