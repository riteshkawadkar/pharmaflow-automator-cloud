export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_impact: string | null
          created_at: string
          description: string
          id: string
          justification: string | null
          priority: Database["public"]["Enums"]["request_priority"]
          regulatory_requirements: string | null
          rejection_reason: string | null
          requester_id: string
          status: Database["public"]["Enums"]["request_status"]
          submitted_at: string | null
          target_completion_date: string | null
          title: string
          updated_at: string
          workflow_data: Json | null
          workflow_type: Database["public"]["Enums"]["workflow_type"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_impact?: string | null
          created_at?: string
          description: string
          id?: string
          justification?: string | null
          priority?: Database["public"]["Enums"]["request_priority"]
          regulatory_requirements?: string | null
          rejection_reason?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          target_completion_date?: string | null
          title: string
          updated_at?: string
          workflow_data?: Json | null
          workflow_type?: Database["public"]["Enums"]["workflow_type"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_impact?: string | null
          created_at?: string
          description?: string
          id?: string
          justification?: string | null
          priority?: Database["public"]["Enums"]["request_priority"]
          regulatory_requirements?: string | null
          rejection_reason?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          target_completion_date?: string | null
          title?: string
          updated_at?: string
          workflow_data?: Json | null
          workflow_type?: Database["public"]["Enums"]["workflow_type"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_definitions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          flow_data: Json
          id: string
          name: string
          published_at: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          updated_at: string
          version: number
          workflow_type: Database["public"]["Enums"]["workflow_type"]
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          flow_data?: Json
          id?: string
          name: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          version?: number
          workflow_type: Database["public"]["Enums"]["workflow_type"]
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          flow_data?: Json
          id?: string
          name?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string
          version?: number
          workflow_type?: Database["public"]["Enums"]["workflow_type"]
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_node_id: string
          execution_data: Json
          execution_status: string
          id: string
          request_id: string
          started_at: string
          updated_at: string
          workflow_definition_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_node_id: string
          execution_data?: Json
          execution_status?: string
          id?: string
          request_id: string
          started_at?: string
          updated_at?: string
          workflow_definition_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_node_id?: string
          execution_data?: Json
          execution_status?: string
          id?: string
          request_id?: string
          started_at?: string
          updated_at?: string
          workflow_definition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_notifications: {
        Row: {
          content: string
          created_at: string
          email_provider_id: string | null
          error_message: string | null
          id: string
          node_id: string
          notification_type: string
          recipients: string[]
          request_id: string
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          email_provider_id?: string | null
          error_message?: string | null
          id?: string
          node_id: string
          notification_type: string
          recipients: string[]
          request_id: string
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          email_provider_id?: string | null
          error_message?: string | null
          id?: string
          node_id?: string
          notification_type?: string
          recipients?: string[]
          request_id?: string
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      workflow_steps: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          name: string
          position_x: number
          position_y: number
          step_id: string
          step_type: Database["public"]["Enums"]["workflow_step_type"]
          workflow_definition_id: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          name: string
          position_x?: number
          position_y?: number
          step_id: string
          step_type: Database["public"]["Enums"]["workflow_step_type"]
          workflow_definition_id: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          name?: string
          position_x?: number
          position_y?: number
          step_id?: string
          step_type?: Database["public"]["Enums"]["workflow_step_type"]
          workflow_definition_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_definition_id_fkey"
            columns: ["workflow_definition_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "approver" | "requester"
      request_priority: "low" | "medium" | "high" | "urgent"
      request_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "cancelled"
      workflow_status: "draft" | "active" | "inactive" | "archived"
      workflow_step_type:
        | "start"
        | "form_input"
        | "approval"
        | "review"
        | "notification"
        | "decision"
        | "parallel_gateway"
        | "exclusive_gateway"
        | "end"
      workflow_type:
        | "drug_approval"
        | "clinical_trial_protocol"
        | "manufacturing_change_control"
        | "quality_deviation_investigation"
        | "regulatory_submission"
        | "pharmacovigilance_case"
        | "supplier_qualification"
        | "batch_record_review"
        | "validation_protocol"
        | "change_request"
        | "corrective_action"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "approver", "requester"],
      request_priority: ["low", "medium", "high", "urgent"],
      request_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "cancelled",
      ],
      workflow_status: ["draft", "active", "inactive", "archived"],
      workflow_step_type: [
        "start",
        "form_input",
        "approval",
        "review",
        "notification",
        "decision",
        "parallel_gateway",
        "exclusive_gateway",
        "end",
      ],
      workflow_type: [
        "drug_approval",
        "clinical_trial_protocol",
        "manufacturing_change_control",
        "quality_deviation_investigation",
        "regulatory_submission",
        "pharmacovigilance_case",
        "supplier_qualification",
        "batch_record_review",
        "validation_protocol",
        "change_request",
        "corrective_action",
        "other",
      ],
    },
  },
} as const
