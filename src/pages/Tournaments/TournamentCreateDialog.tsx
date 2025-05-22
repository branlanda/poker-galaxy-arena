import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Editor } from "@/components/ui/editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from './MultiSelect';

const tournamentFormSchema = z.object({
  name: z.string().min(3, {
    message: "Tournament name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  tournament_type: z.enum(['SIT_N_GO', 'FREEROLL', 'MULTI_TABLE', 'SPECIAL_EVENT', 'SATELLITE']),
  start_time: z.date(),
  buy_in: z.number().min(0),
  prize_pool: z.number().min(0).optional(),
  fee_percent: z.number().min(0).max(100),
  starting_chips: z.number().min(100),
  min_players: z.number().min(2),
  max_players: z.number().min(2),
  late_registration_minutes: z.number().optional(),
  rebuy_allowed: z.boolean(),
  addon_allowed: z.boolean(),
  is_private: z.boolean(),
  access_code: z.string().optional(),
  blind_structure: z.array(z.object({
    level: z.number(),
    small_blind: z.number(),
    big_blind: z.number(),
    ante: z.number(),
    duration_minutes: z.number()
  })),
  payout_structure: z.array(z.object({
    position: z.number(),
    percentage: z.number()
  })),
  is_featured: z.boolean(),
  rules: z.string().optional(),
  banner_url: z.string().optional(),
});

export function TournamentCreateDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof tournamentFormSchema>>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "",
      tournament_type: "MULTI_TABLE",
      start_time: new Date(),
      buy_in: 0,
      fee_percent: 10,
      starting_chips: 1000,
      min_players: 2,
      max_players: 9,
      rebuy_allowed: false,
      addon_allowed: false,
      is_private: false,
      blind_structure: [{ level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 10 }],
      payout_structure: [{ position: 1, percentage: 50 }, { position: 2, percentage: 30 }, { position: 3, percentage: 20 }],
      is_featured: false,
    },
  })

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const [loading, setLoading] = React.useState(false);

  const handleCreateTournament = async (data: z.infer<typeof tournamentFormSchema>) => {
    setLoading(true);
    try {
      if (!user) {
        toast({
          title: t('tournaments.createError'),
          description: t('auth.notLoggedIn'),
          variant: 'destructive'
        });
        return;
      }

      const now = new Date();
      if (data.start_time <= now) {
        toast({
          title: t('tournaments.createError'),
          description: t('tournaments.startTimeInFuture'),
          variant: 'destructive'
        });
        return;
      }

      const { success, error: validationError } = tournamentFormSchema.safeParse(data);
      if (!success) {
        toast({
          title: t('tournaments.createError'),
          description: validationError?.message || t('tournaments.invalidData'),
          variant: 'destructive'
        });
        return;
      }

      const { data: tournament, error: createError } = await supabase
        .from('tournaments_new')
        .insert({
          ...data,
          created_by: user.id,
          status: 'SCHEDULED',
          blind_structure: JSON.stringify(data.blind_structure),
          payout_structure: JSON.stringify(data.payout_structure),
          registration_open_time: new Date().toISOString(),
          start_time: data.start_time.toISOString(),
        })
        .select()
        .single();

      if (createError) {
        throw new Error(createError.message);
      }

      toast({
        title: t('tournaments.createSuccess'),
        description: t('tournaments.tournamentCreated', { name: data.name }),
      });

      navigate('/tournaments');
      setOpen(false);
    } catch (error: any) {
      toast({
        title: t('tournaments.createError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('tournaments.create')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>{t('tournaments.createTournament')}</DialogTitle>
          <DialogDescription>
            {t('tournaments.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateTournament)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('tournaments.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tournament_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('tournaments.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SIT_N_GO">{t('tournaments.sitNGo')}</SelectItem>
                        <SelectItem value="FREEROLL">{t('tournaments.freeroll')}</SelectItem>
                        <SelectItem value="MULTI_TABLE">{t('tournaments.multiTable')}</SelectItem>
                        <SelectItem value="SPECIAL_EVENT">{t('tournaments.specialEvent')}</SelectItem>
                        <SelectItem value="SATELLITE">{t('tournaments.satellite')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('tournaments.startTime')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('tournaments.pickDate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buy_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.buyIn')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prize_pool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.prizePool')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fee_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.fee')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="starting_chips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.startingChips')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.minPlayers')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.maxPlayers')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="late_registration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tournaments.lateRegistration')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="rebuy_allowed"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>{t('tournaments.rebuyAllowed')}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addon_allowed"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>{t('tournaments.addonAllowed')}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>{t('tournaments.private')}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tournaments.rules')}</FormLabel>
                  <FormControl>
                    <Editor
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {t('submit')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
