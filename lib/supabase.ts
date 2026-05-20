// Supabase integration adapter with offline mock database fallback

// Dynamic, persistent mock database adapter that works seamlessly across Client and Server runtimes
class MockSupabaseQueryBuilder {
  private tableName: string
  private queries: Array<{ type: string; args: any[] }> = []
  private action: "select" | "insert" | "update" | "delete" = "select"
  private actionArgs: any = null

  constructor(tableName: string) {
    this.tableName = tableName
  }

  private async executeQuery(): Promise<any> {
    if (typeof window === "undefined") {
      // Server-side execution using local JSON file
      try {
        const { executeMockQueryOnServerInternal } = require("./serverDb")
        return executeMockQueryOnServerInternal(this.tableName, this.action, this.actionArgs, this.queries)
      } catch (err: any) {
        console.error("[MockSupabase Server] Query failed:", err)
        return { data: null, error: err }
      }
    } else {
      // Client-side execution querying our server API route
      try {
        const res = await fetch("/api/mock-db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: this.tableName,
            action: this.action,
            actionArgs: this.actionArgs,
            queries: this.queries
          })
        })
        if (!res.ok) {
          throw new Error(`Mock DB server request failed with status ${res.status}`)
        }
        return await res.json()
      } catch (err: any) {
        console.error("[MockSupabase Client] Query failed:", err)
        return { data: null, error: err }
      }
    }
  }

  select(columns = "*") {
    this.action = "select"
    this.actionArgs = { columns }
    
    const builder = this
    const promise = {
      then(onfulfilled?: any, onrejected?: any) {
        return builder.executeQuery().then(onfulfilled, onrejected)
      },
      eq(columnName: string, value: any) {
        builder.queries.push({ type: "eq", args: [columnName, value] })
        return this
      },
      order(col: string, options?: any) {
        builder.queries.push({ type: "order", args: [col, options] })
        return this
      },
      single() {
        builder.queries.push({ type: "single", args: [] })
        return this
      }
    }
    return promise as any
  }

  insert(records: any | any[]) {
    this.action = "insert"
    this.actionArgs = records
    
    const builder = this
    const promise = {
      then(onfulfilled?: any, onrejected?: any) {
        return builder.executeQuery().then(onfulfilled, onrejected)
      },
      select() {
        return this
      },
      single() {
        builder.queries.push({ type: "single", args: [] })
        return this
      }
    }
    return promise as any
  }

  update(updates: any) {
    this.action = "update"
    this.actionArgs = updates
    
    const builder = this
    const promise = {
      then(onfulfilled?: any, onrejected?: any) {
        return builder.executeQuery().then(onfulfilled, onrejected)
      },
      eq(columnName: string, value: any) {
        builder.queries.push({ type: "eq", args: [columnName, value] })
        return this
      },
      select() {
        return this
      },
      single() {
        builder.queries.push({ type: "single", args: [] })
        return this
      }
    }
    return promise as any
  }

  delete() {
    this.action = "delete"
    
    const builder = this
    const promise = {
      then(onfulfilled?: any, onrejected?: any) {
        return builder.executeQuery().then(onfulfilled, onrejected)
      },
      eq(columnName: string, value: any) {
        builder.queries.push({ type: "eq", args: [columnName, value] })
        return this
      }
    }
    return promise as any
  }
}

// Unified client-side mock interface
export class MockSupabaseClient {
  from(tableName: string) {
    return new MockSupabaseQueryBuilder(tableName)
  }
  
  async rpc(funcName: string, params: any) {
    if (typeof window === "undefined") {
      try {
        const { executeMockQueryOnServerInternal } = require("./serverDb")
        return executeMockQueryOnServerInternal("", "rpc", { funcName, params }, [])
      } catch (err: any) {
        console.error("[MockSupabase Server RPC] Failed:", err)
        return { data: [], error: err }
      }
    } else {
      try {
        const res = await fetch("/api/mock-db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "",
            action: "rpc",
            actionArgs: { funcName, params },
            queries: []
          })
        })
        if (!res.ok) {
          throw new Error(`Mock RPC server request failed with status ${res.status}`)
        }
        return await res.json()
      } catch (err: any) {
        console.error("[MockSupabase Client RPC] Failed:", err)
        return { data: [], error: err }
      }
    }
  }
}

const getActiveClient = () => {
  let url = ""
  let key = ""

  if (typeof window !== "undefined") {
    url = localStorage.getItem("studymate_supabase_url") || ""
    key = localStorage.getItem("studymate_supabase_anon_key") || ""
  }

  if (!url || !key) {
    try {
      const { cookies } = require("next/headers")
      const cookieStore = cookies()
      url = cookieStore.get("studymate_supabase_url")?.value || ""
      key = cookieStore.get("studymate_supabase_anon_key")?.value || ""
    } catch (e) {}
  }

  url = url || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  key = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (url && key && url !== "your-supabase-url") {
    try {
      const { createClient } = require("@supabase/supabase-js")
      return createClient(url, key)
    } catch (e) {
      console.warn("Failed to create live Supabase client, using Mock client:", e)
    }
  }

  return new MockSupabaseClient()
}

// Proxy routing client that resolves the active DB dynamically
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getActiveClient()
    const value = (client as any)[prop]
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  }
}) as any

export default supabase
