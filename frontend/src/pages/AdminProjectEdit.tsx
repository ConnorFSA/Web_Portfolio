import { NavLink, useParams } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { useState, Fragment } from 'react';
import { getToken } from '../api/admin';

function AdminProjectEdit() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <p>Project identifier null or invalid</p>;

  const { project, loading, error } = useProjectDetail(slug);

  const [blocks, setBlocks] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!project) return <p>Project not found</p>;

  // initialize local blocks state once
  if (blocks === null) setBlocks(project.blocks.slice().sort((a, b) => a.position - b.position));

  const move = (index: number, direction: -1 | 1) => {
    if (!blocks) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const next = blocks.slice();
    const tmp = next[newIndex];
    next[newIndex] = next[index];
    next[index] = tmp;
    // reassign positions based on order (0-based or 1-based depending on backend)
    const updated = next.map((b, i) => ({ ...b, position: i }));
    setBlocks(updated);
  };

  const addBlock = async (type: string) => {
    setSaving(true);
    setSaveError(null);
    const newBlock = {
      id: Date.now(), // temporary id, backend will assign a real id
      type,
      project_id: project.id,
      position: blocks ? blocks.length : 0,
      config: type === 'description' ? { text: '' } : type === 'carousel' ? { images: [] } : {},
    };

    try {
      // Get the JWT token from sessionstorage and set the Authorization header if present
      const token = getToken();
      // create an object with the content type and authorization headers if the token is present
      // Record is a Typescript utility type that creates an object with string keys and string values
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      // send the POST request to the backend endpoint for creating a new component
      const response = await fetch(`/api/admin/projects/${project.id}/components`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newBlock),
      });

      if (!response.ok) {
        throw new Error(`Failed to create new block: ${response.statusText}`);
      }

      const createdBlock = await response.json();
      setBlocks((currentBlocks) => [...(currentBlocks || []), createdBlock]);
    } catch (error) {
      setSaveError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const deleteBlock = async (blockId: number) => {
    setSaving(true);
    setSaveError(null);
    try {
      const token = getToken();
      const headers: Record<string, string> ={
        'Content-Type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {})
      }

      const response = await fetch(`/api/admin/projects/${project.id}/components/${blockId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        // Remove the deleted block from the local state
        // Filter out block with the given blockId or return null if blocks is null
        setBlocks((currentBlocks) => currentBlocks?.filter((b) => b.id !== blockId) || null);
      }
    } catch (error) {
      setSaveError(error as Error);
    } finally {
      setSaving(false);
    }
  }

  // Saves the updated blocks to the backend via PATCH request
  const handleSave = async () => {
    // validate the blocks and project before saving
    if (!blocks || !project) return;
    // Set saving state and clear previous errors
    // saving state is used to disable the save button and show a loading indicator
    setSaving(true);
    setSaveError(null);
    // prepare the payload for the PATHCH request
    try {
      // Get the JWT token from sessionstorage and set the Authorization header if present
      const token = getToken();
      // create an object with the content type and authorization headers if the token is present
      // Record is a Typescript utility type that creates an object with string keys and string values
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      // create the payload for the PATCH request by mapping over the blocks and extracting the id, position and config properties
      const payload = blocks.map((b) => ({ id: b.id, position: b.position, config: b.config }));
      // send the PATHCH request to the backend endpoint for updating all components of the project
      const response = await fetch(`/api/admin/projects/${project.id}/components/updateall`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to save blocks: ${response.statusText}`);
      }
    } catch (error) {
      setSaveError(error as Error);
    // finally block is executed to reset the saving state
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
      <NavLink to={`/admin`}> Back to Admin Dashboard </NavLink>

      {blocks && blocks.map((block, i) => (
        <Fragment key={block.id}>
          <p>{block.type} {block.position}</p>
          
          {/* As much as I use this I don't like the value-returning of && */}
          {/* If block.type === 'description' return and render the right side of && */}
          {block.type === 'description' && (
            <textarea key={block.id} 
            onChange={(event) => {
              block.config.text = event.target.value;
            }}>
              {block.config.text}
            </textarea>
          )}
          
          <button onClick={() => deleteBlock(block.id)}>Delete</button>

          <button onClick={() => move(i, -1)}>Position Up</button>
          <button onClick={() => move(i, 1)}>Position Down</button>
        </Fragment>
      ))}

      <div>
        <button onClick={() => {addBlock('description');}}>Add Text Block</button>
        <button onClick={() => {addBlock('carousel');}}>Add Image Block</button>
      </div>

      <div>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {saveError && <p>Save error: {saveError.message}</p>}
      </div>
    </>
  );
}

export default AdminProjectEdit;