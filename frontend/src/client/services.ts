import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

import type {
  Body_login_login_access_token,
  Token,
  UserPublic,
  Message,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UsersPublic,
  UserUpdate,
  UserUpdateMe,
  ItemCreate,
  ItemPublic,
  ItemsPublic,
  ItemUpdate,
  AgentRunResponse,
  AgentStatusResponse,
} from "./models";

export type LoginData = {
  LoginLoginAccessToken: {
    formData: Body_login_login_access_token;
  };
};

export type UsersData = {
  UsersReadUsers: {
    limit?: number;
    skip?: number;
  };
  UsersCreateUser: {
    requestBody: UserCreate;
  };
  UsersUpdateUserMe: {
    requestBody: UserUpdateMe;
  };
  UsersUpdatePasswordMe: {
    requestBody: UpdatePassword;
  };
  UsersRegisterUser: {
    requestBody: UserRegister;
  };
  UsersReadUserById: {
    userId: string;
  };
  UsersUpdateUser: {
    requestBody: UserUpdate;
    userId: string;
  };
  UsersDeleteUser: {
    userId: string;
  };
};

export type ItemsData = {
  ItemsReadItems: {
    limit?: number;
    skip?: number;
  };
  ItemsCreateItem: {
    requestBody: ItemCreate;
  };
  ItemsReadItem: {
    id: string;
  };
  ItemsUpdateItem: {
    id: string;
    requestBody: ItemUpdate;
  };
  ItemsDeleteItem: {
    id: string;
  };
};

export type AgentData = {
  AgentStartAgent: {
    body: string;
    sender: string;
    subject: string;
  };
  AgentGetAgentRun: {
    runId: string;
  };
};

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginLoginAccessToken(
    data: LoginData["LoginLoginAccessToken"],
  ): CancelablePromise<Token> {
    const { formData } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static loginTestToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    });
  }
}

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static usersReadUsers(
    data: UsersData["UsersReadUsers"] = {},
  ): CancelablePromise<UsersPublic> {
    const { skip = 0, limit = 100 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersCreateUser(
    data: UsersData["UsersCreateUser"],
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersReadUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    });
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static usersDeleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/me",
    });
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersUpdateUserMe(
    data: UsersData["UsersUpdateUserMe"],
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static usersUpdatePasswordMe(
    data: UsersData["UsersUpdatePasswordMe"],
  ): CancelablePromise<Message> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersRegisterUser(
    data: UsersData["UsersRegisterUser"],
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersReadUserById(
    data: UsersData["UsersReadUserById"],
  ): CancelablePromise<UserPublic> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static usersUpdateUser(
    data: UsersData["UsersUpdateUser"],
  ): CancelablePromise<UserPublic> {
    const { userId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static usersDeleteUser(
    data: UsersData["UsersDeleteUser"],
  ): CancelablePromise<Message> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class ItemsService {
  /**
   * Read Items
   * Retrieve items.
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static itemsReadItems(
    data: ItemsData["ItemsReadItems"] = {},
  ): CancelablePromise<ItemsPublic> {
    const { skip = 0, limit = 100 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Item
   * Create new item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static itemsCreateItem(
    data: ItemsData["ItemsCreateItem"],
  ): CancelablePromise<ItemPublic> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/items/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Item
   * Get item by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static itemsReadItem(
    data: ItemsData["ItemsReadItem"],
  ): CancelablePromise<ItemPublic> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Item
   * Update an item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static itemsUpdateItem(
    data: ItemsData["ItemsUpdateItem"],
  ): CancelablePromise<ItemPublic> {
    const { id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Item
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static itemsDeleteItem(
    data: ItemsData["ItemsDeleteItem"],
  ): CancelablePromise<Message> {
    const { id } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class AgentService {
  /**
   * Start Agent
   * @returns AgentRunResponse Successful Response
   * @throws ApiError
   */
  public static agentStartAgent(
    data: AgentData["AgentStartAgent"],
  ): CancelablePromise<AgentRunResponse> {
    const { subject, body, sender } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/agent/langgraph",
      query: {
        subject,
        body,
        sender,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Start Agent Langflow
   * @returns AgentRunResponse Successful Response
   * @throws ApiError
   */
  public static agentStartAgentLangflow(): CancelablePromise<AgentRunResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/agent/langflow",
    });
  }

  /**
   * Get Agent Run
   * @returns AgentStatusResponse Successful Response
   * @throws ApiError
   */
  public static agentGetAgentRun(
    data: AgentData["AgentGetAgentRun"],
  ): CancelablePromise<AgentStatusResponse> {
    const { runId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/agent/{run_id}",
      path: {
        run_id: runId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
