import { Task, TaskDetails } from "@/components/custom/task-table";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface TaskDocument {
  id: string;
  filename: string;
  file_url: string;
  file_url_with_protocol: string;
  filetype: string;
  timestamp_of_upload: string;
}

export interface TaskCategory {
  name: string;
  image_url: string;
  img_url_with_protocol: string;
}

interface TaskState {
  tasks: Task[];
  documents: TaskDocument[];
  photos: TaskDocument[];
  categories: TaskCategory[];
  currentTask: Task | null;
  currentTaskDetails: TaskDetails | null;
}

const initialState: TaskState = {
  tasks: [],
  documents: [],
  photos: [],
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
        progress_percentageprogress: 0,
      };
      state.tasks.push(newtask);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
    setTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, () => {
        console.log("Tasks Loading");
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
      }),
      builder
        .addCase(getCategories.pending, () => {
          console.log("Categories Loading");
        })
        .addCase(
          getCategories.fulfilled,
          (state, action: PayloadAction<TaskCategory[]>) => {
            state.categories = action.payload;
          }
        );

    builder
      .addCase(setTaskDetails.pending, () => {
        console.log("Task Details Loading");
      })
      .addCase(
        setTaskDetails.fulfilled,
        (state, action: PayloadAction<TaskDetails>) => {
          state.currentTaskDetails = action.payload;
        }
      );

    builder
      .addCase(setTaskFiles.pending, () => {
        console.log("Task Attachments Loading");
      })
      .addCase(
        setTaskFiles.fulfilled,
        (state, action: PayloadAction<TaskDocument[]>) => {
          state.documents = action.payload.filter(
            (element) => !element.filetype!.includes("image")
          );
          state.photos = action.payload.filter((element) =>
            element.filetype!.includes("image")
          );
        }
      );

    builder
      .addCase(updateTask.pending, () => {
        console.log("Task Updating");
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<TaskDetails>) => {
          state.currentTaskDetails = action.payload;
        }
      );

    builder
      .addCase(removeAssignee.pending, () => {
        console.log("Removing Assignee");
      })
      .addCase(
        removeAssignee.fulfilled,
        (state, action: PayloadAction<String>) => {
          if (state.currentTaskDetails) {
            state.currentTaskDetails.assignee =
              state.currentTaskDetails.assignee.filter(
                (user) => user.user_email != action.payload
              );
          }
        }
      );

      builder
      .addCase(addAttachments.pending, () => {
        console.log("Adding Attachments");
      })
      .addCase(
        addAttachments.fulfilled,
        (state, action: PayloadAction<TaskDocument[]>) => {
            state.documents = [...state.documents, ...action.payload]
        }
      );
  },
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
        "https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.get_task_category_list",
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

export const setTaskFiles = createAsyncThunk(
  "task/setTaskFiles",
  async (taskId: String) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.get(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.get_task_attachments?task_id=${taskId}`,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Get Task Attachemnts:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Get Task Attachemnts failed:", error);
      return [];
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (taskPayload: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.put(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.update_task`,
        taskPayload,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Task Updated", response.data);
      return response.data.details;
    } catch (error) {
      console.error("Task Update failed:", error);
      return [];
    }
  }
);

export const removeAssignee = createAsyncThunk(
  "task/removeAssignee",
  async (assigneePayload: any) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.post(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.remove_users_from_task`,
        assigneePayload,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Assignee Removed", response.data);

      if (response.status == 200) {
        return assigneePayload["user_id"];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Assignee Remove failed:", error);
      return null;
    }
  }
);

export const addAttachments = createAsyncThunk(
  "task/addAttachments",
  async (formData: FormData) => {
    try {
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API credentials");
      }

      const response = await axios.post(
        `https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.upload_attachment`,
        formData,
        {
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
        }
      );

      console.log("Assignee Removed", response.data);

      return response.data.filedata;
    } catch (error) {
      console.error("Assignee Remove failed:", error);
      return null;
    }
  }
);


export const updateTaskProgress = createAsyncThunk(
  "task/updateTaskProgress",
  async (payload: any) => {
    try {
      const formData = new FormData();

      const response = await axios.post(
        "https://buildsuite-dev.app.buildsuite.io/api/method/bs_customisations.api.update_task_progress",
        formData, // Pass the formData object in the request body
        {
          params: payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data; // Return the response data
    } catch (error) {
      return null;
    }
  }
);

export const { addTask, clearTasks, setTask } = taskSlice.actions;

export default taskSlice.reducer;
