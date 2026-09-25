'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Button,
  FileUpload,
  FormField,
  Input,
  Select,
  Textarea,
  cn,
} from '@sypra-ui/ui';

export type SupportCategory = { value: string; label: ReactNode };
export type SupportRequest = {
  name?: string;
  email?: string;
  category?: string;
  subject?: string;
  message: string;
  attachments: File[];
};
export type SupportFields = {
  name?: boolean;
  email?: boolean;
  category?: boolean;
  subject?: boolean;
  attachments?: boolean;
};
export type SupportFormProps = {
  onSubmit?: (request: SupportRequest) => void | Promise<void>;
  categories?: SupportCategory[];
  fields?: SupportFields;
  loading?: boolean;
  error?: ReactNode;
  submitLabel?: ReactNode;
  attachmentAccept?: string;
  children?: ReactNode;
  className?: string;
};

/** A configurable, application-controlled contact or support ticket form. */
export function SupportForm({
  onSubmit,
  categories = [],
  fields,
  loading,
  error,
  submitLabel = 'Send message',
  attachmentAccept,
  children,
  className,
}: SupportFormProps) {
  const visibleFields = {
    name: true,
    email: true,
    category: categories.length > 0,
    subject: true,
    attachments: false,
    ...fields,
  };
  const [values, setValues] = useState({
    name: '',
    email: '',
    category: categories[0]?.value ?? '',
    subject: '',
    message: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit?.({
      name: visibleFields.name ? values.name : undefined,
      email: visibleFields.email ? values.email : undefined,
      category: visibleFields.category ? values.category : undefined,
      subject: visibleFields.subject ? values.subject : undefined,
      message: values.message,
      attachments: visibleFields.attachments ? attachments : [],
    });
  };
  return (
    <form className={cn('space-y-4', className)} onSubmit={submit}>
      {error && (
        <Alert variant="destructive" title="Could not send your message">
          {error}
        </Alert>
      )}
      {visibleFields.name && (
        <FormField label="Name" htmlFor="support-name" required>
          <Input
            id="support-name"
            autoComplete="name"
            value={values.name}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value })
            }
            required
          />
        </FormField>
      )}
      {visibleFields.email && (
        <FormField label="Email" htmlFor="support-email" required>
          <Input
            id="support-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) =>
              setValues({ ...values, email: event.target.value })
            }
            required
          />
        </FormField>
      )}
      {visibleFields.category && (
        <FormField label="Topic" htmlFor="support-category" required>
          <Select
            id="support-category"
            value={values.category}
            onChange={(event) =>
              setValues({ ...values, category: event.target.value })
            }
            required
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </FormField>
      )}
      {visibleFields.subject && (
        <FormField label="Subject" htmlFor="support-subject" required>
          <Input
            id="support-subject"
            value={values.subject}
            onChange={(event) =>
              setValues({ ...values, subject: event.target.value })
            }
            required
          />
        </FormField>
      )}
      <FormField
        label="Message"
        htmlFor="support-message"
        description="Include any details that will help us investigate."
        required
      >
        <Textarea
          id="support-message"
          value={values.message}
          onChange={(event) =>
            setValues({ ...values, message: event.target.value })
          }
          required
        />
      </FormField>
      {visibleFields.attachments && (
        <FormField
          label="Attachments"
          description="Attach screenshots or files that help explain the issue."
        >
          <FileUpload
            accept={attachmentAccept}
            multiple
            label="Choose files"
            onFiles={setAttachments}
          />
        </FormField>
      )}
      {children}
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
