import { Task } from "@/components/custom/task-table";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
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
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, () => {
      console.log("Tasks Loading");
    }).addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    }),

    builder.addCase(getCategories.pending, () => {
      console.log("Categories Loading");
    }).addCase(getCategories.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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

export const { addTask, clearTasks } = taskSlice.actions;

export default taskSlice.reducer;
