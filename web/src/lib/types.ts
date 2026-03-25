export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      Alerta_Metge: {
        Row: {
          creada_el: string | null
          id: number
          missatge: string | null
          resolta: boolean | null
          tipus_alerta: string | null
          treatment_id: number | null
        }
        Insert: {
          creada_el?: string | null
          id?: number
          missatge?: string | null
          resolta?: boolean | null
          tipus_alerta?: string | null
          treatment_id?: number | null
        }
        Update: {
          creada_el?: string | null
          id?: number
          missatge?: string | null
          resolta?: boolean | null
          tipus_alerta?: string | null
          treatment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alerta_metge_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "Treatment"
            referencedColumns: ["id"]
          },
        ]
      }
      Dispositiu_Rellotge: {
        Row: {
          estat: string | null
          id: number
          mac_address: string
          model: string | null
          nivell_bateria: number | null
        }
        Insert: {
          estat?: string | null
          id?: number
          mac_address: string
          model?: string | null
          nivell_bateria?: number | null
        }
        Update: {
          estat?: string | null
          id?: number
          mac_address?: string
          model?: string | null
          nivell_bateria?: number | null
        }
        Relationships: []
      }
      Facultatiu: {
        Row: {
          email: string
          especialitat: string | null
          id: number
          nom: string
        }
        Insert: {
          email: string
          especialitat?: string | null
          id?: number
          nom: string
        }
        Update: {
          email?: string
          especialitat?: string | null
          id?: number
          nom?: string
        }
        Relationships: []
      }
      GameSession: {
        Row: {
          id: number
          level_reached: number | null
          patient_id: number | null
          played_at: string | null
          score: number | null
        }
        Insert: {
          id?: number
          level_reached?: number | null
          patient_id?: number | null
          played_at?: string | null
          score?: number | null
        }
        Update: {
          id?: number
          level_reached?: number | null
          patient_id?: number | null
          played_at?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gamesession_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
        ]
      }
      HealthMetrics: {
        Row: {
          bpm: number | null
          current_radiation: number | null
          distance: number | null
          id: number
          recorded_at: string | null
          steps: number | null
          treatment_id: number | null
        }
        Insert: {
          bpm?: number | null
          current_radiation?: number | null
          distance?: number | null
          id?: number
          recorded_at?: string | null
          steps?: number | null
          treatment_id?: number | null
        }
        Update: {
          bpm?: number | null
          current_radiation?: number | null
          distance?: number | null
          id?: number
          recorded_at?: string | null
          steps?: number | null
          treatment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "healthmetrics_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "Treatment"
            referencedColumns: ["id"]
          },
        ]
      }
      MotivationMessage: {
        Row: {
          id: number
          is_read: boolean | null
          message_text: string
          patient_id: number | null
          sent_at: string | null
        }
        Insert: {
          id?: number
          is_read?: boolean | null
          message_text: string
          patient_id?: number | null
          sent_at?: string | null
        }
        Update: {
          id?: number
          is_read?: boolean | null
          message_text?: string
          patient_id?: number | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motivationmessage_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
        ]
      }
      Patient: {
        Row: {
          address: string | null
          created_at: string | null
          id: number
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: number
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: number
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      Radioisotope: {
        Row: {
          half_life: number | null
          id: number
          name: string
          symbol: string | null
          type: string | null
        }
        Insert: {
          half_life?: number | null
          id?: number
          name: string
          symbol?: string | null
          type?: string | null
        }
        Update: {
          half_life?: number | null
          id?: number
          name?: string
          symbol?: string | null
          type?: string | null
        }
        Relationships: []
      }
      Settings: {
        Row: {
          id: number
          notifications_enabled: boolean | null
          patient_id: number | null
          theme: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          notifications_enabled?: boolean | null
          patient_id?: number | null
          theme?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          notifications_enabled?: boolean | null
          patient_id?: number | null
          theme?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
        ]
      }
      Treatment: {
        Row: {
          expected_end_date: string | null
          facultatiu_id: number | null
          id: number
          initial_radiation: number | null
          isolation_days: number | null
          patient_id: number | null
          radioisotope_id: number | null
          rellotge_id: number | null
          room: number | null
          start_date: string | null
          status: string | null
          unit_id: number | null
        }
        Insert: {
          expected_end_date?: string | null
          facultatiu_id?: number | null
          id?: number
          initial_radiation?: number | null
          isolation_days?: number | null
          patient_id?: number | null
          radioisotope_id?: number | null
          rellotge_id?: number | null
          room?: number | null
          start_date?: string | null
          status?: string | null
          unit_id?: number | null
        }
        Update: {
          expected_end_date?: string | null
          facultatiu_id?: number | null
          id?: number
          initial_radiation?: number | null
          isolation_days?: number | null
          patient_id?: number | null
          radioisotope_id?: number | null
          rellotge_id?: number | null
          room?: number | null
          start_date?: string | null
          status?: string | null
          unit_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_facultatiu_id_fkey"
            columns: ["facultatiu_id"]
            isOneToOne: false
            referencedRelation: "Facultatiu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_radioisotope_id_fkey"
            columns: ["radioisotope_id"]
            isOneToOne: false
            referencedRelation: "Radioisotope"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_rellotge_id_fkey"
            columns: ["rellotge_id"]
            isOneToOne: false
            referencedRelation: "Dispositiu_Rellotge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "UnitCatalog"
            referencedColumns: ["id"]
          },
        ]
      }
      UnitCatalog: {
        Row: {
          id: number
          name: string
          symbol: string
        }
        Insert: {
          id?: number
          name: string
          symbol: string
        }
        Update: {
          id?: number
          name?: string
          symbol?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

// ──────────────────────────────────────────
// Convenience row-level type aliases
// ──────────────────────────────────────────

export type AlertaMetge = Database['public']['Tables']['Alerta_Metge']['Row']

export type HealthMetrics = Database['public']['Tables']['HealthMetrics']['Row']

export type TreatmentWithDetails = Database['public']['Tables']['Treatment']['Row'] & {
  Patient: Database['public']['Tables']['Patient']['Row'] | null
  Facultatiu: Database['public']['Tables']['Facultatiu']['Row'] | null
  Dispositiu_Rellotge: Database['public']['Tables']['Dispositiu_Rellotge']['Row'] | null
  Radioisotope: Database['public']['Tables']['Radioisotope']['Row'] | null
  UnitCatalog: Database['public']['Tables']['UnitCatalog']['Row'] | null
}

export type AlertWithTreatment = Database['public']['Tables']['Alerta_Metge']['Row'] & {
  Treatment: (Database['public']['Tables']['Treatment']['Row'] & {
    Patient: Pick<Database['public']['Tables']['Patient']['Row'], 'name'> | null
  }) | null
}
