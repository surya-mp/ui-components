import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  Alert,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Popover,
  Pagination,
  Tooltip,
  type DataColumn,
} from './index';

describe('DataTable', () => {
  it('renders typed custom cells without domain assumptions', () => {
    type Row = { id: string; name: string; active: boolean };
    const columns: DataColumn<Row>[] = [
      { key: 'name', header: 'Name' },
      {
        key: 'active',
        header: 'Status',
        cell: (row) => (row.active ? 'Active' : 'Invited'),
      },
    ];
    const markup = renderToStaticMarkup(
      <DataTable
        data={[{ id: '1', name: 'Avery', active: true }]}
        columns={columns}
      />,
    );
    expect(markup).toContain('Avery');
    expect(markup).toContain('Active');
  });
});

describe('interactive controls', () => {
  it('closes a dialog with Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <Button>Save</Button>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Open settings' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('reports controlled dialog state changes without owning the state', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Dialog open={false} onOpenChange={change}>
        <DialogTrigger>Open controlled</DialogTrigger>
        <DialogContent>
          <DialogTitle>Controlled</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open controlled' }));
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves a movable dialog from its drag handle', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent movable>
          <DialogTitle>Move me</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const handle = screen.getByText('Drag to move');
    fireEvent.pointerDown(handle, { clientX: 20, clientY: 20 });
    fireEvent.pointerMove(window, { clientX: 60, clientY: 50 });
    fireEvent.pointerUp(window);
    expect(screen.getByRole('dialog')).toHaveStyle({
      transform: 'translate(40px, 30px)',
    });
  });

  it('honors pagination boundaries and page changes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Pagination page={1} pageSize={10} total={25} onPageChange={change} />,
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(change).toHaveBeenCalledWith(2);
  });

  it('reports page-size changes from the controlled pagination API', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={100}
        onPageChange={() => undefined}
        onPageSizeChange={change}
      />,
    );
    await user.selectOptions(screen.getByLabelText('Rows per page'), '20');
    expect(change).toHaveBeenCalledWith(20);
  });

  it('sorts rows and preserves custom cell renderers', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string; active: boolean };
    const columns: DataColumn<Row>[] = [
      { key: 'name', header: 'Name', sortable: true },
      {
        key: 'active',
        header: 'Status',
        cell: (row) => (row.active ? 'Active' : 'Invited'),
      },
    ];
    render(
      <DataTable
        data={[
          { id: '1', name: 'Zed', active: false },
          { id: '2', name: 'Avery', active: true },
        ]}
        columns={columns}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Avery');
    expect(screen.getByText('Invited')).toBeVisible();
  });

  it('dismisses a popover with an outside click', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover trigger={<Button>More</Button>}>Actions</Popover>
        <Button>Outside</Button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByText('Actions')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('uses semantic theme tokens and permits local tooltip overrides', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Alert variant="success">Saved</Alert>
        <Tooltip content="Helpful" className="!rounded-none">
          <Button>Help</Button>
        </Tooltip>
      </>,
    );

    expect(screen.getByRole('alert')).toHaveClass(
      'bg-[hsl(var(--rui-success-background))]',
    );
    await user.hover(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByRole('tooltip')).toHaveClass(
      'bg-[hsl(var(--rui-tooltip))]',
      '!rounded-none',
    );
  });
});
