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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      obras: {
        Row: {
          autores: string
          capa_url: string | null
          categoria: string | null
          created_at: string | null
          data_publicacao: string | null
          doi: string | null
          id: string
          open_access: boolean | null
          pdf_url: string | null
          pedido_id: string | null
          publicado: boolean | null
          resumo: string | null
          slug: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autores: string
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          data_publicacao?: string | null
          doi?: string | null
          id?: string
          open_access?: boolean | null
          pdf_url?: string | null
          pedido_id?: string | null
          publicado?: boolean | null
          resumo?: string | null
          slug: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autores?: string
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          data_publicacao?: string | null
          doi?: string | null
          id?: string
          open_access?: boolean | null
          pdf_url?: string | null
          pedido_id?: string | null
          publicado?: boolean | null
          resumo?: string | null
          slug?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_arquivos: {
        Row: {
          id: string
          nome: string
          pedido_id: string
          tipo: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          id?: string
          nome: string
          pedido_id: string
          tipo: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          id?: string
          nome?: string
          pedido_id?: string
          tipo?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_arquivos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_etapas: {
        Row: {
          atual: boolean | null
          concluida: boolean | null
          data: string | null
          descricao: string | null
          id: string
          label: string
          ordem: number
          pedido_id: string
        }
        Insert: {
          atual?: boolean | null
          concluida?: boolean | null
          data?: string | null
          descricao?: string | null
          id?: string
          label: string
          ordem?: number
          pedido_id: string
        }
        Update: {
          atual?: boolean | null
          concluida?: boolean | null
          data?: string | null
          descricao?: string | null
          id?: string
          label?: string
          ordem?: number
          pedido_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_etapas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_mudancas: {
        Row: {
          acao: string
          created_at: string | null
          descricao: string | null
          id: string
          pedido_id: string
          usuario: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          pedido_id: string
          usuario?: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          pedido_id?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_mudancas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_servicos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          pedido_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          pedido_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          pedido_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_servicos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          codigo: string
          data_atualizacao: string | null
          data_criacao: string | null
          faixa_paginas: string | null
          id: string
          modalidade: string | null
          open_access: boolean | null
          orcamento_final: number
          plano: string
          status: string
          tipo: string
          titulo: string
          usuario_id: string
          valor_base: number
        }
        Insert: {
          codigo: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          faixa_paginas?: string | null
          id?: string
          modalidade?: string | null
          open_access?: boolean | null
          orcamento_final?: number
          plano: string
          status?: string
          tipo: string
          titulo: string
          usuario_id: string
          valor_base?: number
        }
        Update: {
          codigo?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          faixa_paginas?: string | null
          id?: string
          modalidade?: string | null
          open_access?: boolean | null
          orcamento_final?: number
          plano?: string
          status?: string
          tipo?: string
          titulo?: string
          usuario_id?: string
          valor_base?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nome: string
          tipo?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
