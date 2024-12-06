"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ClipboardFormProps {
  onSubmit: (text: string) => void;
  initialValue?: string;
}

export function ClipboardForm({
  onSubmit,
  initialValue = "",
}: ClipboardFormProps) {
  const form = useForm({
    defaultValues: {
      text: initialValue,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data.text);
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter text to save..."
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save to Clipboard
        </Button>
      </form>
    </Form>
  );
}
